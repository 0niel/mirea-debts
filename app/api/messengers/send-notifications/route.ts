import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import {
  SupabaseClient,
  createRouteHandlerClient,
} from "@supabase/auth-helpers-nextjs"

import { Database } from "@/lib/supabase/db-types"
import TelegramApi from "@/lib/telegram-api"

export const dynamic = "force-dynamic"

type Body = {
  retake: Database["rtu_mirea"]["Tables"]["retakes"]["Row"]
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  const data = await request.json()

  const newRetake = data as Body

  const studentIds = await getStudentIds(newRetake.retake.discipline, supabase)

  const students = await getStudents(studentIds, supabase)

  await sendMessages(students, newRetake.retake, supabase)

  return NextResponse.json({ success: true })
}

async function getStudentIds(
  discipline: string,
  supabase: SupabaseClient<Database>
) {
  const { data: studentDebts } = await supabase
    .schema("rtu_mirea")
    .from("debts_disciplines")
    .select("*")
    .eq("name", discipline)

  const studentUuids = studentDebts?.map((debt) => debt.student_uuid) ?? []

  return studentUuids
}

async function getStudents(
  studentUuids: string[],
  supabase: SupabaseClient<Database>
) {
  const students = await Promise.all(
    studentUuids.map(async (studentId) => {
      const { data: student } = await supabase
        .schema("rtu_mirea")
        .from("students")
        .select("*")
        .eq("student_uuid", studentId)
        .single()

      return student
    })
  )

  return students
}

async function sendMessages(
  students: any[],
  retake: any,
  supabase: SupabaseClient<Database>
) {
  const chunkSize = 10
  const chunks = Math.ceil(students.length / chunkSize)

  for (let i = 0; i < chunks; i++) {
    const start = i * chunkSize
    const end = start + chunkSize
    const chunk = students.slice(start, end)

    await Promise.all(
      chunk.map(async (student) => {
        const { data: socialNetwork } = await supabase
          .schema("rtu_mirea")
          .from("social_networks")
          .select("*")
          .eq("student_id", student?.student_uuid)
          .single()

        if (socialNetwork) {
          await TelegramApi.sendMessage(
            socialNetwork.external_id,
            `По предмету ${
              retake.discipline
            } появилась новая пересдача! Дата: ${retake.date
              .split("-")
              .reverse()
              .join(".")}\n\nУзнайте подробнее на https://debts.mirea.ru/`
          )
        }
      })
    )

    if (i < chunks - 1) {
      await sleep(3000)
    }
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
