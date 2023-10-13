import { NextResponse, type NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

import { UserPermissionsManager } from "./lib/user-permissions-manager"

const isEmployeesOnlyPage = (pathname: string) => {
  return pathname === "/dashboard" || pathname === "/add"
}

export const config = {
  matcher: ["/", "/dashboard", "/add", "/student", "/login"],
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  const session = await supabase.auth.getSession()

  const user = session.data.session?.user

  if (req.nextUrl.pathname === "/login") {
    return res
  }

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  const permissionsManager = new UserPermissionsManager(user)

  if (!permissionsManager.isEmployee() && !permissionsManager.isStudent()) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  if (
    isEmployeesOnlyPage(req.nextUrl.pathname) &&
    permissionsManager.isStudent()
  ) {
    return NextResponse.redirect(new URL("/student", req.nextUrl))
  }

  if (req.nextUrl.pathname === "/") {
    if (permissionsManager.isEmployee()) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
    } else {
      return NextResponse.redirect(new URL("/student", req.nextUrl))
    }
  }

  return res
}
