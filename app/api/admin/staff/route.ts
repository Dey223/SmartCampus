import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

// Ensure table exists
async function ensureTable() {
    await sql`
    CREATE TABLE IF NOT EXISTS staff_users (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(20),
      department VARCHAR(100),
      position VARCHAR(100),
      hire_date DATE,
      status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
      password_hash VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `
}

// GET - List all staff
export async function GET() {
    try {
        await ensureTable()

        const staff = await sql`
      SELECT 
        id, first_name, last_name, email, phone, 
        department, position, hire_date, status, created_at
      FROM staff_users
      ORDER BY created_at DESC
    `

        return NextResponse.json({ staff })
    } catch (error) {
        console.error('Error fetching staff:', error)
        return NextResponse.json(
            { error: 'Failed to fetch staff' },
            { status: 500 }
        )
    }
}

// POST - Create new staff member
export async function POST(request: Request) {
    try {
        await ensureTable()

        const body = await request.json()
        const { first_name, last_name, email, phone, department, position, hire_date } = body

        // Validate required fields
        if (!first_name || !last_name || !email) {
            return NextResponse.json(
                { error: 'First name, last name, and email are required' },
                { status: 400 }
            )
        }

        // Insert new staff member
        const [newStaff] = await sql`
      INSERT INTO staff_users (
        first_name, last_name, email, phone, department, position, hire_date
      ) VALUES (
        ${first_name}, ${last_name}, ${email}, ${phone || null}, 
        ${department || null}, ${position || null}, ${hire_date || null}
      )
      RETURNING id, first_name, last_name, email, phone, department, position, hire_date, status, created_at
    `

        return NextResponse.json({ staff: newStaff }, { status: 201 })
    } catch (error: any) {
        console.error('Error creating staff:', error)

        if (error.message?.includes('duplicate key')) {
            return NextResponse.json(
                { error: 'Email already exists' },
                { status: 409 }
            )
        }

        return NextResponse.json(
            { error: 'Failed to create staff member' },
            { status: 500 }
        )
    }
}

// PUT - Update staff member
export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const { id, first_name, last_name, email, phone, department, position, hire_date, status } = body

        if (!id) {
            return NextResponse.json(
                { error: 'Staff ID is required' },
                { status: 400 }
            )
        }

        const [updatedStaff] = await sql`
      UPDATE staff_users
      SET 
        first_name = ${first_name},
        last_name = ${last_name},
        email = ${email},
        phone = ${phone || null},
        department = ${department || null},
        position = ${position || null},
        hire_date = ${hire_date || null},
        status = ${status || 'active'},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, first_name, last_name, email, phone, department, position, hire_date, status, updated_at
    `

        if (!updatedStaff) {
            return NextResponse.json(
                { error: 'Staff member not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ staff: updatedStaff })
    } catch (error) {
        console.error('Error updating staff:', error)
        return NextResponse.json(
            { error: 'Failed to update staff member' },
            { status: 500 }
        )
    }
}

// DELETE - Remove staff member
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { error: 'Staff ID is required' },
                { status: 400 }
            )
        }

        await sql`DELETE FROM staff_users WHERE id = ${id}`

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting staff:', error)
        return NextResponse.json(
            { error: 'Failed to delete staff member' },
            { status: 500 }
        )
    }
}
