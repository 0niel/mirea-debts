import { Suspense } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ChartsCards } from "@/components/charts/ChartsCards"
import { RecentActivity } from "@/app/dashboard/RecentActivity"
import SelfRetakesTable from "@/app/dashboard/SelfRetakesTable"

export const dynamic = "force-dynamic"

export default async function Dashboard() {
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
        <Suspense
          fallback={
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                <Skeleton className="h-52 w-full" />
                <Skeleton className="h-52 w-full" />
              </div>
              <div>
                <Skeleton className="h-52 w-full" />
              </div>
            </>
          }
        >
          {/* @ts-ignore */}
          <ChartsCards />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-72 w-full" />}>
          {/* @ts-ignore */}
          <RecentActivity />
        </Suspense>

        <SelfRetakesTable />
      </div>
    </>
  )
}
