import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { de } from "date-fns/locale"

import {
  getAllRetakesByDebtsDisciplines,
  getOwnDebtsDisciplines,
  getSession,
} from "@/lib/supabase/supabase-server"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { UserNav } from "@/components/UserNav"
import { YearDebtAlert } from "@/components/YearDebtAlert"

import DebtsCard from "./DebtsCard"
import { OnlineEduDisciplinesCard } from "./OnlineEduDisciplinesCard"
import { SelfRetakesTable } from "./SelfRetakesTable"

export const dynamic = "force-dynamic"

export default async function Student() {
  const session = await getSession()

  if (!session?.user) return redirect("/login")

  if (session.user.email?.includes("@mirea.ru")) {
    return redirect("/dashboard")
  }

  const debts = await getOwnDebtsDisciplines()

  const retakes = await getAllRetakesByDebtsDisciplines(
    (debts ?? []).map((debt) => debt.name)
  )

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Привет, {session.user.user_metadata.name}
          </h2>
          <p className="text-muted-foreground">
            Здесь вы можете посмотреть расписание пересдач и информацию о
            задолженностях.
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {/* <YearDebtAlert /> */}
        <div className="grid gap-4 md:grid-cols-2">
          <DebtsCard debts={debts ?? []} />
          <OnlineEduDisciplinesCard />
        </div>
        <SelfRetakesTable retakes={retakes} /> *
      </div>
    </>
  )
}
