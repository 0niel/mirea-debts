import { redirect } from "next/navigation"

import { getSession, getUserDepartment } from "@/lib/supabase/supabase-server"

import { EmployeesPermissionsCard } from "./EmployeesPermissionsCard"

export const dynamic = "force-dynamic"

export default async function Employees() {
  const session = await getSession()

  if (!session?.user) redirect("/login")

  const department = await getUserDepartment(session?.user.id)

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Управление сотрудниками
        </h2>
      </div>
      <div className="space-y-4">
        {/* @ts-ignore */}
        <EmployeesPermissionsCard
          department={
            department ?? "Не удалось получить информацию о подразделении"
          }
        />
      </div>
    </>
  )
}
