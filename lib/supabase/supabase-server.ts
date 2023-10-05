import { cache } from "react"
import { cookies } from "next/headers"
import {
  User,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs"

import { Database } from "./db-types"

export const createServerSupabaseClient = cache(() =>
  createServerComponentClient<Database, "rtu_mirea">({ cookies })
)

const createServiceSupabaseClient = cache(() =>
  createServerComponentClient<Database, "rtu_mirea">(
    { cookies },
    { supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY }
  )
)

export async function getSession() {
  const supabase = createServerSupabaseClient()
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}

export async function getStatistics() {
  const supabase = createServerSupabaseClient()
  try {
    const { data: statistics } = await supabase
      .schema("rtu_mirea")
      .from("statistics")
      .select("*")
    return statistics
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}

export async function getUniqueDisciplines() {
  const supabase = createServiceSupabaseClient()
  try {
    const { data } = await supabase
      .schema("rtu_mirea")
      .rpc("get_unique_disciplines")
    return data as unknown as string[]
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}

export async function getOwnDebtsDisciplines() {
  const supabase = createServiceSupabaseClient()
  const me = await supabase.auth.getUser()
  try {
    const { data } = await supabase
      .schema("rtu_mirea")
      .from("debts_disciplines")
      .select("*")
      .eq("student_uuid", me.data.user?.user_metadata.provider_id)
    console.log(data)
    return data
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}
