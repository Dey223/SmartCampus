import { login } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const body = await request.json()

    // Convert JSON body to FormData to match the lib/auth signature
    const formData = new FormData()
    formData.append("email", body.email)
    formData.append("password", body.password)

    const user = await login(formData)

    if (!user) {
        return NextResponse.json(
            { error: "Invalid credentials" },
            { status: 401 }
        )
    }

    return NextResponse.json(user)
}
