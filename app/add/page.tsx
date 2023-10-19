import { redirect } from "next/navigation"
import { ListIcon } from "lucide-react"

import {
  getSession,
  getUniqueDisciplines,
} from "@/lib/supabase/supabase-server"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { CreationForm } from "./CreationForm"

export const dynamic = "force-dynamic"

export default async function Add() {
  const session = await getSession()

  if (!session?.user) redirect("/login")

  const disciplines = await getUniqueDisciplines()

  return (
    <>
      <Alert variant={disciplines?.length ? "default" : "destructive"}>
        <ListIcon className="h-4 w-4" />
        <AlertTitle>
          {disciplines?.length ? (
            <>Найдено {disciplines?.length} дисциплин для вас</>
          ) : (
            <>Не найдено дисциплин для вас</>
          )}
        </AlertTitle>
        <AlertDescription>
          Мы отобразим вам только те дисциплины, которые закреплены за вашей
          кафедрой, основываясь на вашем подразделении «
          {session.user.user_metadata.custom_claims.employee.group_name}». Если
          вы не видите какую-то дисциплину, то обратитесь к администратору.
        </AlertDescription>
      </Alert>

      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Создание пересдачи
        </h2>
      </div>
      <div className="space-y-4">
        <CreationForm disciplines={disciplines ?? []} />
      </div>
    </>
  )
}
