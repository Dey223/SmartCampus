import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

// Helper to ensure table exists
async function ensureTable() {
    await sql`
    CREATE TABLE IF NOT EXISTS announcements (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(50) DEFAULT 'general',
        author_name VARCHAR(100),
        author_email VARCHAR(255),
        target_audience VARCHAR(50) DEFAULT 'all',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { title, content, targetAudience, category } = body

        // 1. Ensure table exists
        await ensureTable()

        // 2. Insert Announcement
        await sql`
      INSERT INTO announcements (
        title, 
        content, 
        target_audience, 
        category,
        author_name,
        author_email
      )
      VALUES (
        ${title}, 
        ${content}, 
        ${targetAudience}, 
        ${category},
        'Staff Member',
        'staff@campus.com'
      )
    `

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Announcement error:", error)
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}
