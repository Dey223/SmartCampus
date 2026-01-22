import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { title, location, category, priority, description } = body

        // We assume the existence of maintenance_tickets table from initial schema
        await sql`
      INSERT INTO maintenance_tickets (
        title, 
        building_id, -- We'll define null or fix this if we have robust location parsing. For now let's assume NULL if not parsed or ID=1 default
        room_id, 
        ticket_type,
        category,
        priority,
        status, 
        description,
        reported_by,
        reporter_email
      )
      VALUES (
        ${title},
        NULL, -- Simplified: Location string is in description for now or we need a proper lookup
        NULL,
        'incident',
        ${category},
        ${priority},
        'open',
        ${description + ' [Lieu: ' + location + ']'}, 
        'Staff Member',
        'staff@campus.com'
      )
    `

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Incident error:", error)
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}
