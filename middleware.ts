import { NextResponse, type NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

import { UserPermissionsManager } from "./lib/user-permissions-manager"

const isEmployeesOnlyPage = (pathname: string) => {
  return (
    pathname.includes("/dashboard") ||
    pathname.includes("/add") ||
    pathname.includes("/students")
  )
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - auth (auth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - service-worker.js (service worker file)
     */
    "/((?!api|auth|_next/static|_next/image|favicon.ico|service-worker.js).*)",
  ],
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const redirectUrl = req.nextUrl.clone()

  if (!session && !req.url.includes("/login")) {
    redirectUrl.pathname = "/login"
    redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  const user = session?.user

  if (user) {
    const permissionsManager = new UserPermissionsManager(user)

    if (
      isEmployeesOnlyPage(req.nextUrl.pathname) &&
      permissionsManager.isStudent()
    ) {
      redirectUrl.pathname = "/student"
      return NextResponse.redirect(redirectUrl)
    } else if (req.nextUrl.pathname === "/") {
      if (permissionsManager.isEmployee()) {
        redirectUrl.pathname = "/dashboard"
      } else {
        redirectUrl.pathname = "/student"
      }
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}
