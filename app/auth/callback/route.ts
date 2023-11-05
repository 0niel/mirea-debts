import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import {
  setEmployeeUserIdByProviderId,
  updateOwnProfile,
} from "@/lib/supabase/supabase-server"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the Auth Helpers package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-sign-in-with-code-exchange
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    const tokenResponse = await supabase.auth.exchangeCodeForSession(code)

    if (tokenResponse.data?.user?.id) {
      const userId = tokenResponse.data?.user?.id
      const providerId = tokenResponse.data?.user?.user_metadata?.provider_id

      if (providerId) {
        await setEmployeeUserIdByProviderId(providerId, userId)
        await updateOwnProfile(tokenResponse.data?.user)
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(
    process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL ?? requestUrl.origin
  )
}
