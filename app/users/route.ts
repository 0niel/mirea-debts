import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const supabase = createRouteHandlerClient(
    { cookies },
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    }
  )

  const me = await supabase.auth.getUser()
  if (!me.data.user?.email?.includes("@mirea.ru")) {
    return NextResponse.redirect(`/login?error=Could not authenticate user`, {
      status: 301,
    })
  }

  const userId = searchParams.get("userId")

  const { data, error } = await supabase.auth.admin.getUserById(
    userId as string
  )

  if (error) {
    return NextResponse.redirect(`/login?error=Could not authenticate user`, {
      status: 301,
    })
  }

  return NextResponse.json({
    id: userId,
    ...data,
  })
}
