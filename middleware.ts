import { NextRequest, NextResponse } from "next/server"
import { decrypt } from "@/lib/auth"

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     * 5. /login
     */
    "/((?!api/|_next/|_static/|_vercel|login|[\\w-]+\\.\\w+).*)",
  ],
}

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl
  const hostname = req.headers.get("host") || ""
  const path = url.pathname

  // Allow localhost shortcuts/subdomain access
  const isTargetingAdmin = hostname.includes("admin.") || hostname === "localhost:3000" || hostname === "smartcampus.com"
  const isTargetingStaff = hostname.includes("staff.")
  const isTargetingStudent = hostname.includes("student.")

  // 1. Check for session
  const cookie = req.cookies.get("session")?.value
  let session = null

  if (cookie) {
    try {
      session = await decrypt(cookie)
    } catch (e) {
      // Invalid session
    }
  }

  // 2. Protected Routes Logic
  const isAdminRoute = path.startsWith("/admin") || (isTargetingAdmin && path === "/")
  const isStaffRoute = path.startsWith("/staff") || (isTargetingStaff && path === "/")

  // Bypass logic for direct path access on localhost (unchanged)
  if (isTargetingAdmin && (path.startsWith("/student") || path.startsWith("/staff") || path.startsWith("/admin"))) {
    // Continue to checking permissions if it's admin or staff path
  }

  // If trying to access Admin or Staff areas without session -> Redirect to Login
  if ((isAdminRoute || isStaffRoute) && !session) {
    // redirect to login
    const loginUrl = new URL("/login", req.nextUrl)
    return NextResponse.redirect(loginUrl)
  }

  // RBAC: If logged in, check roles
  if (session) {
    // Prevent Staff from accessing Admin
    if (isAdminRoute && session.user.role !== "admin") {
      return NextResponse.rewrite(new URL("/403", req.url)) // Or redirect to staff dashboard
    }

    // Prevent Admin from accessing Staff? Usually Admin can access everything, but let's be strict or lenient.
    // Let's say Admin can access everything for now.
  }

  // 3. Routing Logic (Subdomains)
  if (isTargetingStudent) {
    url.pathname = `/student${url.pathname}`
    return NextResponse.rewrite(url)
  }

  if (isTargetingStaff) {
    url.pathname = `/staff${url.pathname}`
    return NextResponse.rewrite(url)
  }

  if (isTargetingAdmin) {
    // Treat as admin, BUT allow direct path access to other portals for localhost testing
    if (url.pathname.startsWith("/student") || url.pathname.startsWith("/staff") || url.pathname.startsWith("/admin")) {
      return NextResponse.next()
    }

    // Default root -> Admin Dashboard
    // Ensure we don't loop if we are already at /admin
    if (!url.pathname.startsWith("/admin")) {
      url.pathname = `/admin${url.pathname}`
      return NextResponse.rewrite(url)
    }
  }

  return NextResponse.next()
}
