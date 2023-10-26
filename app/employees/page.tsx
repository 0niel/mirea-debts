import { redirect } from "next/navigation"

import { getSession } from "@/lib/supabase/supabase-server"

import { EmployeesPermissionsCard } from "./Employees"

export const dynamic = "force-dynamic"

export default async function Employees() {
  const session = await getSession()

  if (!session?.user) redirect("/login")

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Управление сотрудниками
        </h2>
      </div>
      <div className="space-y-4">
        <EmployeesPermissionsCard
          department={
            session?.user.user_metadata.custom_claims.employee.group_name
          }
        />
      </div>
    </>
  )
}
