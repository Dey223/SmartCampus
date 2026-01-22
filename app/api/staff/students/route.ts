import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

// Helper to ensure table exists
async function ensureTable() {
    await sql`
    CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        student_id VARCHAR(50) UNIQUE NOT NULL,
        program VARCHAR(100),
        enrollment_date DATE DEFAULT CURRENT_DATE,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { firstName, lastName, email, studentId, program } = body

        // 1. Ensure table exists (Self-healing infrastructure)
        await ensureTable()

        // 2. Insert Student
        await sql`
      INSERT INTO students (first_name, last_name, email, student_id, program)
      VALUES (${firstName}, ${lastName}, ${email}, ${studentId}, ${program})
    `

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error("Registration error:", error)
        if (error.code === '23505') { // Unique violation
            return NextResponse.json({ error: "Cet ID ou Email existe déjà." }, { status: 409 })
        }
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}
