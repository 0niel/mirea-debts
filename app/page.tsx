import { redirect } from "next/navigation"

import { getSession } from "@/lib/supabase/supabase-server"

export const dynamic = "force-dynamic"

export default async function Index() {
  const session = await getSession()

  if (!session?.user) redirect("/login")

  if (session.user.email?.includes("@mirea.ru")) {
    return redirect("/dashboard")
  } else {
    return redirect("/student")
  }
}
