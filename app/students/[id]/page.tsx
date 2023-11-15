import { redirect } from "next/navigation"

import {
  getSession,
  getStudentById,
  getStudentDebtsById,
  getStudentRetakesById,
} from "@/lib/supabase/supabase-server"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RetakesTable } from "@/components/RetakesTable"

export const dynamic = "force-dynamic"

export default async function StudentById({
  params,
}: {
  params: { id: string }
}) {
  const session = await getSession()

  if (!session?.user) redirect("/login")

  const [student, debts, retakes] = await Promise.all([
    getStudentById(params.id),
    getStudentDebtsById(params.id),
    getStudentRetakesById(params.id),
  ])

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {student?.first_name} {student?.last_name}
        </h2>
      </div>
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Информация о студенте</CardTitle>
              <CardDescription>
                Информация о студенте и его долги.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-6">
                <div className="grid items-center justify-between gap-4 md:grid-cols-2">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {student?.first_name[0]} {student?.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium leading-none">
                        {student?.first_name} {student?.last_name}{" "}
                        {student?.second_name}
                        <span className="ml-2 text-sm text-muted-foreground">
                          {student?.email}
                        </span>
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {student?.academic_group}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="ml-auto">
                    Отправить сообщение
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium leading-none">Институт</p>
                    <p className="text-sm text-muted-foreground">
                      {student?.institute}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium leading-none">
                      Направление
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {student?.direction_code}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium leading-none">Статус</p>
                    <p className="text-sm text-muted-foreground">
                      {student?.status}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium leading-none">
                      Личный номер
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {student?.personal_number}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Долги студента</CardTitle>
              <CardDescription>
                Долги студента и пересдачи по этим дисциплинам.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {debts?.length ? (
                debts?.map((debt) => (
                  <div key={debt.id} className="flex items-center space-x-4">
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {debt.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {debt.department}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">
                  Долгов нет или у вас нет прав, чтобы просматривать их.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
        <RetakesTable retakes={retakes ?? []} />
      </div>
    </>
  )
}
