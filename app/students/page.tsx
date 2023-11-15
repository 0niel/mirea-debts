import { redirect } from "next/navigation"

import { getSession, getUserDepartment } from "@/lib/supabase/supabase-server"
import { DataTable } from "@/components/table/DataTable"
import { columns } from "@/app/students/columns"

export const dynamic = "force-dynamic"

export default async function Students() {
  const session = await getSession()

  if (!session?.user) redirect("/login")

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Студенты</h2>
      </div>
      <div className="space-y-4">
        <DataTable data={[]} columns={columns} onFilter={(value) => {}} />
      </div>
    </>
  )
}
