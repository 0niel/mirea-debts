"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts"

import { Database } from "@/lib/supabase/db-types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { CustomTooltip } from "./CustomTooltip"

export function DebtsTotalChartCard({
  statistics,
}: {
  statistics: Database["rtu_mirea"]["Tables"]["analytics"]["Row"][]
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
        <div className="text-2xl font-bold">{data[data.length - 1]?.debts}</div>
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
  )
}
