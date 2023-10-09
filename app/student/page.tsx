import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { de } from "date-fns/locale"

import {
  getAllRetakesByDebtsDisciplines,
  getConnectedSocialNetworks,
  getOwnDebtsDisciplines,
  getSession,
} from "@/lib/supabase/supabase-server"
import TelegramApi from "@/lib/telegram-api"
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
import { TelegramConnectionCard } from "./TelegramConnectionCard"

export const dynamic = "force-dynamic"

export default async function Student() {
  // Preload Telegram API
  await TelegramApi.initCallback()

  const session = await getSession()

  if (!session?.user) return redirect("/login")

  if (session.user.email?.includes("@mirea.ru")) {
    return redirect("/dashboard")
  }

  const debts = await getOwnDebtsDisciplines()

  const retakes = await getAllRetakesByDebtsDisciplines(
    (debts ?? []).map((debt) => debt.name)
  )

  const connectedSocialNetweork = await getConnectedSocialNetworks()

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
          <div className="grid gap-4 md:grid-cols-2">
            <OnlineEduDisciplinesCard />
            <TelegramConnectionCard
              user={session.user}
              telegram={connectedSocialNetweork}
            />
          </div>
        </div>

        <SelfRetakesTable retakes={retakes} />
      </div>
    </>
  )
}
