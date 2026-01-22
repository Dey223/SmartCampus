import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:5000'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { days = 7 } = body

        // Fetch historical energy data from database (last 30 days)
        const historicalData = await sql`
      SELECT 
        recorded_at as timestamp,
        value
      FROM energy_readings
      WHERE reading_type = 'electricity'
        AND recorded_at >= CURRENT_DATE - INTERVAL '30 days'
      ORDER BY recorded_at ASC
    `

        // Transform data for Python service
        const formattedData = historicalData.map((row: any) => ({
            timestamp: row.timestamp.toISOString(),
            value: parseFloat(row.value)
        }))

        // Call Python prediction service
        const pythonResponse = await fetch(`${PYTHON_SERVICE_URL}/api/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                historical_data: formattedData,
                prediction_days: days
            })
        })

        if (!pythonResponse.ok) {
            const error = await pythonResponse.json()
            return NextResponse.json(
                { error: error.error || 'Prediction service error' },
                { status: pythonResponse.status }
            )
        }

        const predictions = await pythonResponse.json()

        return NextResponse.json(predictions)
    } catch (error) {
        console.error('Energy prediction error:', error)
        return NextResponse.json(
            { error: 'Failed to generate predictions' },
            { status: 500 }
        )
    }
}
