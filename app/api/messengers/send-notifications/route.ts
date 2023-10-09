import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

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

  const { data: studentDebts } = (await supabase
    .schema("rtu_mirea")
    .from("debts_disciplines")
    .select("*")
    .eq("name", newRetake.retake.discipline)) as {
    data: Database["rtu_mirea"]["Tables"]["debts_disciplines"]["Row"][] | null
  }
  const studentIds = studentDebts?.map((debt) => debt.student_uuid) ?? []

  const students = await Promise.all(
    studentIds.map(async (studentId) => {
      const { data: student } = (await supabase
        .schema("auth")
        .from("students")
        .select("*")
        .eq("student_uuid", studentId)
        .single()) as {
        data: Database["rtu_mirea"]["Tables"]["students"]["Row"] | null
      }
      return student
    })
  )

  students.forEach(async (student) => {
    const { data: socialNetwork } = (await supabase
      .schema("rtu_mirea")
      .from("social_networks")
      .select("*")
      .eq("student_id", student?.student_uuid)
      .single()) as {
      data: Database["rtu_mirea"]["Tables"]["social_networks"]["Row"] | null
    }

    if (socialNetwork) {
      await TelegramApi.sendMessage(
        socialNetwork.external_id,
        `По предмету ${
          newRetake.retake.discipline
        } появилась новая пересдача! Дата: ${newRetake.retake.date
          .split("-")
          .reverse()
          .join(".")}\n\nУзнайте подробнее на https://debts.mirea.ru/`
      )
    }
  })
}
