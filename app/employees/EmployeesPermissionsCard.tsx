import { getEmployeesDepartmentCount } from "@/lib/supabase/supabase-server"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Employee } from "./Employee"
import { EmployeesList } from "./EmployeesList"

export async function EmployeesPermissionsCard({
  department,
}: {
  department: string
}) {
  const employeesCount = await getEmployeesDepartmentCount(department)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          {department[0].toUpperCase() + department.slice(1)}
        </CardTitle>
        <CardDescription>
          Вы можете управлять доступом к пересдачам для сотрудников вашей
          кафедры.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {employeesCount ? (
          <EmployeesList
            employeesCount={employeesCount}
            department={department}
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            Не найдено сотрудников для вашего подразделения. Возможно, вы
            работаете в неучебном подразделении или у вас есть внутреннее
            совместительство, но мы получили данные о другом подразделении.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
