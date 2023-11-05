"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts"

import { institutes, institutesShortNames } from "@/lib/institutes"
import { Database } from "@/lib/supabase/db-types"
import { StatisticsByInstitutes } from "@/lib/supabase/statistics-by-institutes-type"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { CustomTooltip } from "./CustomTooltip"

export function DebtorsPercentageByInstitutesChartCard({
  statistics,
}: {
  statistics: Database["rtu_mirea"]["Tables"]["statistics"]["Row"][]
}) {
  const byInstitutes =
    (statistics[statistics.length - 1]
      ?.by_institutes as StatisticsByInstitutes) ?? {}

  const studentsByInstitute = institutes.map((institute) => {
    const students = byInstitutes[institute]?.students
    return students ?? 0
  })

  const debtorsByInstitute = institutes.map((institute) => {
    const debtors = byInstitutes[institute]?.debtors
    return debtors ?? 0
  })

  const data = institutes.map((institute, index) => ({
    institute,
    students: studentsByInstitute[index],
    debtors: debtorsByInstitute[index],
    debtorsPercent: Math.round(
      (debtorsByInstitute[index] / studentsByInstitute[index]) * 100
    ),
    name: institutesShortNames.get(institute) ?? institute,
  }))

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-normal">
          Доля должников от кол-ва обучающихся (в %)
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[80px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <Bar
                dataKey="debtorsPercent"
                style={
                  {
                    fill: "var(--theme-primary)",
                    opacity: 1,
                    "--theme-primary": `hsl(47.9 95.8% 53.1%)`,
                  } as React.CSSProperties
                }
              />
              <XAxis
                dataKey="name"
                strokeOpacity={0}
                className="text-sm text-muted-foreground"
              />
              <Tooltip
                content={
                  <CustomTooltip
                    payload={undefined}
                    label={undefined}
                    active={undefined}
                    payloadSuffix="%"
                  />
                }
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
