import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import { getSession, getStatistics } from "@/lib/supabase/supabase-server"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import CardsStats from "@/components/CardStats"
import { RecentActivity } from "@/components/RecentActivity"

export const dynamic = "force-dynamic"

export default async function Dashboard() {
  const session = await getSession()

  if (!session?.user) redirect("/login")

  const statistics = await getStatistics()
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Обзор</h2>
        <div className="flex items-center space-x-2">
          <Button>Создать пересдачу</Button>
        </div>
      </div>
      <div className="space-y-4">
        <CardsStats statistics={statistics ?? []} />
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Последняя активность</CardTitle>
              <CardDescription>
                В этом месяце было назначено 13 пересдач.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivity />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
