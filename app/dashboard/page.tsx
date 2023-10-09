import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import { institutes } from "@/lib/institutes"
import {
  getInstituteDebtors,
  getInstituteStudents,
  getSession,
  getStatistics,
} from "@/lib/supabase/supabase-server"
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
import SelfRetakesTable from "@/app/dashboard/SelfRetakesTable"

export const dynamic = "force-dynamic"

export default async function Dashboard() {
  const session = await getSession()

  if (!session?.user) redirect("/login")

  if (!session.user.email?.includes("@mirea.ru")) {
    return redirect("/student")
  }

  const statistics = await getStatistics()

  const studentsByInstitute = await Promise.all(
    institutes.map(async (institute) => {
      const students = await getInstituteStudents(institute)
      return students ?? 0
    })
  )

  const debtorsByInstitute = await Promise.all(
    institutes.map(async (institute) => {
      const debtors = await getInstituteDebtors(institute)
      return debtors ?? 0
    })
  )

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Обзор</h2>
        <div className="flex items-center space-x-2">
          <Link href="/add">
            <Button>Создать пересдачу</Button>
          </Link>
        </div>
      </div>
      <div className="space-y-4">
        <CardsStats
          statistics={statistics ?? []}
          institutes={institutes}
          studentsByInstitute={studentsByInstitute}
          debtorsByInstitute={debtorsByInstitute}
        />

        <RecentActivity />

        <SelfRetakesTable />
      </div>
    </>
  )
}
