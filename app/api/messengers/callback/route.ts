import { SupabaseClient, createClient } from "@supabase/supabase-js"

import { Database } from "@/lib/supabase/db-types"
import TelegramApi from "@/lib/telegram-api"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

type TelegramMessage = {
  message: {
    text: string
    from: {
      id: number
      username: string
    }
  }
}

async function handleTelegramEvent(
  request: Request,
  supabase: SupabaseClient<Database>
) {
  const { message } = (await request.json()) as TelegramMessage

  if (!message || !message.text.startsWith("/start ")) {
    return NextResponse.json({ ok: true })
  }

  const { data: user } = await supabase.auth.admin.getUserById(
    message.text.slice(7)
  )

  if (!user.user) {
    await TelegramApi.sendMessage(
      message.from.id.toString(),
      "Не удалось подключить аккаунт. Попробуйте ещё раз."
    )
    return NextResponse.json({ ok: true })
  }

  const { data: userSocialNetwork } = await supabase
    .schema("rtu_mirea")
    .from("social_networks")
    .select("*")
    .eq("user_id", user.user.id)
    .single()

  if (userSocialNetwork) {
    await TelegramApi.sendMessage(
      message.from.id.toString(),
      "Вы уже подключили свой аккаунт Telegram. Сперва отвяжите его!"
    )
    return NextResponse.json({ ok: true })
  }

  const { data: student } = await supabase
    .schema("rtu_mirea")
    .from("students")
    .select("*")
    .eq("student_uuid", user.user.user_metadata.provider_id)
    .single()

  await supabase.schema("rtu_mirea").from("social_networks").upsert({
    user_id: user.user.id,
    username: message.from.username,
    external_id: message.from.id.toString(),
    student_id: student?.student_uuid,
  })

  await TelegramApi.sendMessage(
    message.from.id.toString(),
    "Ваш аккаунт Telegram успешно подключен. Теперь вы можете получать уведомления о новых пересдачах."
  )

  return NextResponse.json({ ok: true })
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get("secret")

  if (secret !== process.env.CALLBACK_SECRET_URL_STRING) {
    console.error("Wrong secret:", secret)
    return NextResponse.json({ error: "You are not allowed to access this page" })
  }

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  return handleTelegramEvent(request, supabase)
}
