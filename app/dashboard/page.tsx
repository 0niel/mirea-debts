import Link from "next/link"
import { redirect } from "next/navigation"

import { institutes } from "@/lib/institutes"
import { StatisticsByInstitutes } from "@/lib/supabase/statistics-by-institutes-type"
import { getSession, getStatistics } from "@/lib/supabase/supabase-server"
import { Button } from "@/components/ui/button"
import CardsStats from "@/components/CardStats"
import { RecentActivity } from "@/components/RecentActivity"
import SelfRetakesTable from "@/app/dashboard/SelfRetakesTable"

export const dynamic = "force-dynamic"

export default async function Dashboard() {
  const session = await getSession()

  if (!session?.user) redirect("/login")

  const statistics = (await getStatistics()) ?? []

  const byInstitutes =
    (statistics[statistics.length - 1]
      .by_institutes as StatisticsByInstitutes) ?? {}

  const studentsByInstitute = institutes.map((institute) => {
    const students = byInstitutes[institute]?.students
    return students ?? 0
  })

  const debtorsByInstitute = institutes.map((institute) => {
    const debtors = byInstitutes[institute]?.debtors
    return debtors ?? 0
  })

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
