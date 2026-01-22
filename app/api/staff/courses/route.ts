import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { title, date, startTime, duration, roomId, professor } = body

        // Calculate timestamps
        const startDateTime = new Date(`${date}T${startTime}`)
        const endDateTime = new Date(startDateTime.getTime() + (Number(duration) * 60 * 60 * 1000))

        // Insert into reservations table (used for courses too)
        await sql`
      INSERT INTO reservations (
        title, 
        room_id, 
        user_name, 
        user_email, 
        user_type, 
        start_time, 
        end_time, 
        status,
        description
      )
      VALUES (
        ${title}, 
        ${roomId}, 
        ${professor}, 
        'staff@campus.com', 
        'professor', 
        ${startDateTime.toISOString()}, 
        ${endDateTime.toISOString()}, 
        'confirmed',
        'Cours planifié par Staff'
      )
    `

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Planning error:", error)
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}
