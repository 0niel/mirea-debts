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
      .throwOnError()
    return statistics
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}

export async function getUniqueDisciplines() {
  const supabase = createServerSupabaseClient()
  try {
    const { data } = await supabase
      .schema("rtu_mirea")
      .rpc("get_unique_disciplines")
      .throwOnError()
    return data as unknown as string[]
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}

export async function getOwnDebtsDisciplines() {
  const supabase = createServerSupabaseClient()
  const me = await supabase.auth.getUser()
  try {
    const { data } = await supabase
      .schema("rtu_mirea")
      .from("debts_disciplines")
      .select("*")
      .eq("student_uuid", me.data.user?.user_metadata.provider_id)
      .throwOnError()
    return data
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}

export async function getAllRetakesByDebtsDisciplines(disciplines: string[]) {
  const supabase = createServerSupabaseClient()

  const retakesData = await Promise.all(
    disciplines.map(async (discipline) => {
      try {
        const { data } = await supabase
          .schema("rtu_mirea")
          .from("retakes")
          .select("*")
          .eq("discipline", discipline)
          .order("date", { ascending: true })
          // Only active retakes
          .filter("date", "gte", new Date().toISOString())
          .throwOnError()
        return data ?? []
      } catch (error) {
        console.error("Error:", error)
        return []
      }
    })
  )

  const retakes = retakesData.flat().filter((retake) => retake !== null)

  return retakes
}

export async function getConnectedSocialNetworks() {
  const supabase = createServerSupabaseClient()
  const me = await supabase.auth.getUser()
  try {
    const { data } = await supabase
      .schema("rtu_mirea")
      .from("social_networks")
      .select("*")
      .eq("user_id", me.data?.user?.id ?? "")
      .single()
      .throwOnError()
    return data
  } catch (error) {
    return null
  }
}

export async function setEmployeeUserIdByProviderId(
  providerId: string,
  userId: string
) {
  const supabase = createServerSupabaseClient()
  try {
    await supabase
      .schema("rtu_mirea")
      .from("employees")
      .update({
        user_id: userId,
      })
      .eq("employee_uuid", providerId)
      .throwOnError()
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}
