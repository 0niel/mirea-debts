"use client"

import { use, useEffect, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts"

import { institutesShortNames } from "@/lib/institutes"
import { Database, Json } from "@/lib/supabase/db-types"
import { StatisticsByInstitutes } from "@/lib/supabase/statistics-by-institutes-type"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function CustomTooltip({ payload, label, active, payloadSuffix = "" }: any) {
  if (active) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="flex flex-col">
          <span className="font-bold text-muted-foreground">
            {payload[0].value} {payloadSuffix ?? ""}
          </span>
        </div>
      </div>
    )
  }

  return null
}

export default function CardsStats({
  statistics,
  institutes,
  studentsByInstitute,
  debtorsByInstitute,
}: {
  statistics: Database["rtu_mirea"]["Tables"]["statistics"]["Row"][]
  institutes: string[]
  studentsByInstitute: number[]
  debtorsByInstitute: number[]
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

  const data2 = institutes.map((institute, index) => ({
    institute,
    students: studentsByInstitute[index],
    debtors: debtorsByInstitute[index],
    debtorsPercent: Math.round(
      (debtorsByInstitute[index] / studentsByInstitute[index]) * 100
    ),
    name: institutesShortNames.get(institute) ?? institute,
  }))

  const [debtorsDisplayMode, setDebtorsDisplayMode] = useState<"all" | string>(
    "all"
  )

  useEffect(() => {
    const getData = () => {
      if (debtorsDisplayMode === "all") {
        return getDebtsAndDebtorsForAllByTime()
      }

      const fullInstituteName = Array.from(institutesShortNames.entries()).find(
        ([fullName, shortName]) => {
          return fullName === debtorsDisplayMode
        }
      )?.[0]

      if (!fullInstituteName) {
        return getDebtsAndDebtorsForAllByTime()
      }

      const instituteData = statistics.map((stat) => {
        const byInstitutes = stat.by_institutes as StatisticsByInstitutes
        const debtors = byInstitutes?.[fullInstituteName].debtors ?? 0
        return {
          debtors,
          debts: stat.debts,
          name: stat.created_at.split("T")[0].split("-").reverse().join("."),
        }
      })

      return instituteData
    }

    setData(getData())
  }, [debtorsDisplayMode])

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-normal">
              Всего должников
            </CardTitle>
            <div className="flex flex-row items-center space-x-2">
              <Select
                value={debtorsDisplayMode}
                onValueChange={setDebtorsDisplayMode}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Режим отображения" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Всего</SelectItem>
                    {institutes.map((institute) => (
                      <SelectItem value={institute} key={institute}>
                        {institutesShortNames.get(institute) ?? institute}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-normal">
              Кол-во долгов
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data[data.length - 1]?.debts}
            </div>
            <div className="mt-4 h-[80px]">
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
                    dataKey="debts"
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
      </div>

      <div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-normal">
              Доля должников от кол-ва обучающихся (в %)
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data2}>
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
      </div>
    </>
  )
}
