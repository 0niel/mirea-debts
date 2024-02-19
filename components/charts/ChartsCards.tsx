import {
  getSession,
  getStatistics,
  getUserDepartment,
} from "@/lib/supabase/supabase-server"

import { DebtorsPercentageByInstitutesChartCard } from "./DebtorsPercentageByInstitutesChartCard"
import { DebtorsTotalChartCard } from "./DebtorsTotalChartCard"
import { DebtsTotalChartCard } from "./DebtsTotalChartCard"

export const dynamic = "force-dynamic"

export async function ChartsCards() {
  const session = await getSession()
  const department = await getUserDepartment(session!.user.id)
  const statistics = (await getStatistics()) ?? []

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
        <DebtorsTotalChartCard
          statistics={statistics}
          department={department!}
        />
        <DebtsTotalChartCard statistics={statistics} department={department!} />
      </div>

      {/*<div>*/}
      {/*  <DebtorsPercentageByInstitutesChartCard statistics={statistics}/>*/}
      {/*</div>*/}
    </>
  )
}
