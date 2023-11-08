import { ListIcon } from "lucide-react"

import {
  getSession,
  getUniqueDisciplinesByDepartment,
  getUserDepartment,
} from "@/lib/supabase/supabase-server"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { CreationForm } from "./CreationForm"

export default async function ContentWithDisciplines() {
  const session = await getSession()

  const department = await getUserDepartment(session?.user.id ?? "")

  const disciplines = await getUniqueDisciplinesByDepartment(department ?? "")

  // В названии дисциплин убираем номер предмета, семестр, тип
  const disciplinesNames = disciplines
    ?.map((discipline) => {
      const regex = /(.*) \((.*)\)/
      const matches = regex.exec(discipline)
      return matches?.length ? matches[1] : discipline
    })
    .filter((value, index, self) => self.indexOf(value) === index)

  return (
    <>
      <Alert variant={disciplines?.length ? "default" : "destructive"}>
        <ListIcon className="h-4 w-4" />
        <AlertTitle>
          {disciplines?.length ? (
            <>Найдено {disciplinesNames?.length} дисциплин для вас</>
          ) : (
            <>Не найдено дисциплин для вас</>
          )}
        </AlertTitle>
        <AlertDescription>
          Мы отобразим вам только те дисциплины, которые закреплены за вашей
          кафедрой, основываясь на вашем подразделении «
          {department ??
            session?.user.user_metadata.custom_claims.employee.group_name}
          ». Если вы не видите какую-то дисциплину, то обратитесь к
          администратору.
        </AlertDescription>
      </Alert>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Создание пересдачи
        </h2>
      </div>
      <div className="space-y-4">
        <CreationForm
          disciplines={disciplines ?? []}
          disciplinesNames={disciplinesNames ?? []}
        />
      </div>
    </>
  )
}
