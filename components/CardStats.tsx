"use client"

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

import { Database } from "@/lib/supabase/db-types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function CustomTooltip({ payload, label, active }: any) {
  if (active) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="flex flex-col">
          <span className="font-bold text-muted-foreground">
            {payload[0].value}
          </span>
        </div>
      </div>
    )
  }

  return null
}

export default function CardsStats({
  statistics,
}: {
  statistics: Database["rtu_mirea"]["Tables"]["statistics"]["Row"][]
}) {
  const data = statistics
    .sort((a, b) => {
      return Date.parse(a.created_at) - Date.parse(b.created_at)
    })
    .map((stat) => ({
      debtors: stat.debtors,
      debts: stat.debts,
      name: stat.created_at.split("T")[0].split("-").reverse().join("."),
    }))

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-normal">
            Всего должников
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
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data[data.length - 1]?.debtors}
          </div>
          {/* <p className="text-xs text-muted-foreground">
            +20.1%
          </p> */}
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
          <CardTitle className="text-base font-normal">Кол-во долгов</CardTitle>
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
          {/* <p className="text-xs text-muted-foreground">
            +180.1% from last month
          </p> */}
          <div className="mt-4 h-[80px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <Bar
                  dataKey="debts"
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
                    />
                  }
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}