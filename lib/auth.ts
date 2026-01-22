import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const secretKey = "smart-campus-secret-key-change-this-in-prod"
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h") // Session lasts 24 hours
        .sign(key)
}

export async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ["HS256"],
    })
    return payload
}

export async function login(formData: FormData) {
    // Using static credentials for POC as requested
    // In production, verify against DB using bcrypt/argon2
    const email = formData.get("email")
    const password = formData.get("password")

    // Mock User Database
    const users = [
        { email: "admin@smartcampus.com", password: "admin", role: "admin", name: "Admin User" },
        { email: "staff@smartcampus.com", password: "staff", role: "staff", name: "Staff Member" },
    ]

    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
        return null
    }

    // Create the session
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    const session = await encrypt({ user, expires })

    // Save the session in a cookie
    const cookieStore = await cookies()
    cookieStore.set("session", session, { expires, httpOnly: true })

    return user
}

export async function logout() {
    // Destroy the session
    const cookieStore = await cookies()
    cookieStore.set("session", "", { expires: new Date(0) })
}

export async function getSession() {
    const cookieStore = await cookies()
    const session = cookieStore.get("session")?.value
    if (!session) return null
    return await decrypt(session)
}

export async function updateSession(request: NextRequest) {
    const session = request.cookies.get("session")?.value
    if (!session) return

    // Refresh the session so it doesn't expire
    const parsed = await decrypt(session)
    parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const res = NextResponse.next()
    res.cookies.set({
        name: "session",
        value: await encrypt(parsed),
        httpOnly: true,
        expires: parsed.expires,
    })
    return res
}
