"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts"

import { institutes, institutesShortNames } from "@/lib/institutes"
import { Database } from "@/lib/supabase/db-types"
import { StatisticsByDepartments } from "@/lib/supabase/statistics-by-departments-type"
import { StatisticsByInstitutes } from "@/lib/supabase/statistics-by-institutes-type"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { CustomTooltip } from "./CustomTooltip"

export function DebtorsTotalChartCard({
  statistics,
  department,
}: {
  statistics: Database["rtu_mirea"]["Tables"]["analytics"]["Row"][]
  department: string
}) {
  const getDebtsAndDebtorsForAllByTime = () => {
    return statistics
      .sort((a, b) => {
        return Date.parse(a.created_at) - Date.parse(b.created_at)
      })
      .map((stat) => ({
        debtors: stat.debtors,
        debts: stat.debts,
        name: stat.created_at.split("T")[0].split("-").reverse().join("."),
      }))
  }

  const [data, setData] = useState(getDebtsAndDebtorsForAllByTime())
  // const [debtorsDisplayMode, setDebtorsDisplayMode] = useState<"all" | string>(
  //   "all"
  // )

  useEffect(() => {
    const getData = () => {
      // if (debtorsDisplayMode === "all") {
      //   return getDebtsAndDebtorsForAllByTime()
      // }
      //
      // const fullInstituteName = Array.from(institutesShortNames.entries()).find(
      //   ([fullName, shortName]) => {
      //     return fullName === debtorsDisplayMode
      //   }
      // )?.[0]
      //
      // if (!fullInstituteName) {
      //   return getDebtsAndDebtorsForAllByTime()
      // }

      return statistics.map((stat) => {
        // const byInstitutes = stat.by_institutes as StatisticsByInstitutes
        const byDepartments = stat.by_departments as StatisticsByDepartments
        const debtors = byDepartments?.[department].debtors ?? 0
        const debts = byDepartments?.[department].debts ?? 0
        return {
          debtors,
          debts,
          name: stat.created_at.split("T")[0].split("-").reverse().join("."),
        }
      })
    }

    setData(getData())
  }, [department, statistics])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-normal">Всего должников</CardTitle>
        {/*<div className="flex flex-row items-center space-x-2">*/}
        {/*  <Select*/}
        {/*    value={debtorsDisplayMode}*/}
        {/*    onValueChange={setDebtorsDisplayMode}*/}
        {/*  >*/}
        {/*    <SelectTrigger>*/}
        {/*      <SelectValue placeholder="Режим отображения" />*/}
        {/*    </SelectTrigger>*/}
        {/*    <SelectContent>*/}
        {/*      <SelectGroup>*/}
        {/*        <SelectItem value="all">Всего</SelectItem>*/}
        {/*        {institutes.map((institute) => (*/}
        {/*          <SelectItem value={institute} key={institute}>*/}
        {/*            {institutesShortNames.get(institute) ?? institute}*/}
        {/*          </SelectItem>*/}
        {/*        ))}*/}
        {/*      </SelectGroup>*/}
        {/*    </SelectContent>*/}
        {/*  </Select>*/}
        {/*</div>*/}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {data[data.length - 1]?.debtors}
        </div>
        <div className="h-[80px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <Line
                type="monotone"
                strokeWidth={2}
                dataKey="debtors"
                activeDot={{
                  r: 6,
                  style: { fill: "var(--theme-primary)", opacity: 0.25 },
                }}
                style={
                  {
                    stroke: "var(--theme-primary)",
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
                  />
                }
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
