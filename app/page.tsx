import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import { getSession } from "@/lib/supabase/supabase-server"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RecentActivity } from "@/components/RecentActivity"

export const dynamic = "force-dynamic"

export default async function Index() {
  const session = await getSession()

  if (!session?.user) redirect("/login")

  console.log(session.user)
  console.log(session.user.user_metadata)

  if (session.user.email?.includes("@mirea.ru")) {
    return redirect("/dashboard")
  } else {
    return redirect("/student")
  }
}
