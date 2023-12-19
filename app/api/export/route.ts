import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import {
  SupabaseClient,
  createRouteHandlerClient,
} from "@supabase/auth-helpers-nextjs"
import ExcelJS from "exceljs"

import { Database } from "@/lib/supabase/db-types"

export const dynamic = "force-dynamic"

type Body = {
  department: string
}

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const department = request.nextUrl.searchParams.get("department") || ""
  const students = await getStudentsByDepartment(department, supabase)

  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet("Лист 1")
  sheet.addRow([
    "Идентификатор",
    "Группа",
    "Фамилия",
    "Имя",
    "Отчество",
    "Личный номер",
    "Институт",
    "Задолженности",
  ])

  students?.forEach(async (student) => {
    const debts = await getDebtsByStudent(student.id, supabase)
    debts?.forEach((debt) => {
      sheet.addRow([student.id, debt.name])
    })
  })

  const buffer = await workbook.xlsx.writeBuffer()
  const today = new Date().toISOString().slice(0, 10)

  return new NextResponse(buffer, {
    status: 200,
    headers: new Headers({
      "Content-Disposition": `attachment; filename="export_${today}.xlsx"`,
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
  })
}

async function getStudentsByDepartment(
  department: string,
  supabase: SupabaseClient<Database>
) {
  const { data: students } = await supabase
    .schema("rtu_mirea")
    .rpc("search_students", {
      _limit: 5000,
      _offset: 0,
      _department: department ?? undefined,
    })
  return students
}

async function getDebtsByStudent(
  student_id: string,
  supabase: SupabaseClient<Database>
) {
  const { data: debts } = await supabase
    .schema("rtu_mirea")
    .from("debts_disciplines")
    .select("name")
    .eq("student_uuid", student_id)
  return debts
}
