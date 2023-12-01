import { redirect } from "next/navigation"

import {
  getSession,
  getUniqueDisciplinesByDepartment,
  getUniqueGroupsByDepartment,
  getUserDepartment,
} from "@/lib/supabase/supabase-server"

import StudentsTable from "./StudentsTable"

export const dynamic = "force-dynamic"

export default async function Students() {
  const session = await getSession()

  if (!session?.user) redirect("/login")

  const department = await getUserDepartment(session.user.id)

  const [groups, disciplines] = await Promise.all([
    getUniqueGroupsByDepartment(department ?? ""),
    getUniqueDisciplinesByDepartment(department ?? ""),
  ])

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Студенты</h2>
      </div>
      <div className="space-y-4">
        <StudentsTable
          availableGroups={groups ?? []}
          availableDisciplines={disciplines ?? []}
          department={department ?? undefined}
        />
      </div>
    </>
  )
}
