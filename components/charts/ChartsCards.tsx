import { getStatistics } from "@/lib/supabase/supabase-server"

import { DebtorsPercentageByInstitutesChartCard } from "./DebtorsPercentageByInstitutesChartCard"
import { DebtorsTotalChartCard } from "./DebtorsTotalChartCard"
import { DebtsTotalChartCard } from "./DebtsTotalChartCard"

export const dynamic = "force-dynamic"

export async function ChartsCards() {
  const statistics = (await getStatistics()) ?? []

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
        <DebtorsTotalChartCard statistics={statistics} />

        <DebtsTotalChartCard statistics={statistics} />
      </div>

      <div>
        <DebtorsPercentageByInstitutesChartCard statistics={statistics} />
      </div>
    </>
  )
}
