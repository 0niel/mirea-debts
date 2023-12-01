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
    console.error("[getSession] Error:", error)
    return null
  }
}

export async function getStatistics() {
  const supabase = createServerSupabaseClient()
  try {
    const { data: statistics } = await supabase
      .schema("rtu_mirea")
      .from("analytics")
      .select("*")
      .throwOnError()
    return statistics
  } catch (error) {
    console.error("[getStatistics] Error:", error)
    return null
  }
}

export async function getUniqueDisciplinesByDepartment(department: string) {
  const supabase = createServerSupabaseClient()
  try {
    const { data } = await supabase
      .schema("rtu_mirea")
      .rpc("get_unique_disciplines_by_department", {
        _department: department,
      })
      .throwOnError()
    return data as unknown as string[]
  } catch (error) {
    console.error("[getUniqueDisciplines] Error:", error)
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
    console.error("[getOwnDebtsDisciplines] Error:", error)
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
        console.error("[getAllRetakesByDebtsDisciplines] Error:", error)
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
    console.error("[getConnectedSocialNetworks] Error:", error)
    return null
  }
}

export async function setEmployeeUserIdByProviderId(
  providerId: string,
  userId: string
) {
  const supabase = createServerSupabaseClient()

  try {
    const res = await supabase
      .schema("rtu_mirea")
      .from("employees")
      .update({
        user_id: userId,
      })
      .eq("human_uuid", providerId)
      .throwOnError()
  } catch (error) {
    console.error("[setEmployeeUserIdByProviderId] Error:", error)
    return null
  }
}

export async function updateOwnProfile(user: User) {
  const supabase = createServerSupabaseClient()
  try {
    await supabase
      .schema("rtu_mirea")
      .from("profiles")
      .upsert({
        id: user.id,
        first_name: user.user_metadata?.name,
        last_name: user.user_metadata?.family_name,
        second_name: user.user_metadata?.middle_name,
        human_uuid: user.user_metadata?.provider_id,
        email: user.email ?? "",
      })
      .throwOnError()
  } catch (error) {
    console.error("[updateOwnProfile] Error:", error)
    return null
  }
}

export async function getEmployeesDepartmentCount(department: string) {
  const supabase = createServerSupabaseClient()
  try {
    const { count } = await supabase
      .schema("rtu_mirea")
      .from("employees")
      .select("id", { count: "exact", head: true })
      .eq("department", department)
      .throwOnError()
    return count
  } catch (error) {
    console.error("[getEmployeesDepartmentCount] Error:", error)
    return null
  }
}

export async function getUserDepartment(userId: string) {
  const supabase = createServerSupabaseClient()

  try {
    const { data } = await supabase
      .schema("rtu_mirea")
      .from("employees")
      .select("department")
      .eq("user_id", userId)
      .single()
      .throwOnError()

    return data?.department
  } catch (error) {
    console.error("[getUserDepartment] Error:", error)
    return null
  }
}

export async function getRecentRetakes() {
  const supabase = createServerSupabaseClient()

  try {
    const { data } = await supabase
      .schema("rtu_mirea")
      .from("retakes")
      .select("*")
      .order("created_at", { ascending: false })
      // Last 30 days
      .filter(
        "created_at",
        "gte",
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      )
      .limit(100)
      .throwOnError()
    return data
  } catch (error) {
    console.error("[getRecentRetakes] Error:", error)
    return null
  }
}

export async function getProfile(userId: string) {
  const supabase = createServerSupabaseClient()

  try {
    const { data } = await supabase
      .schema("rtu_mirea")
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()
      .throwOnError()
    return data
  } catch (error) {
    console.error("[getProfile] Error:", error)
    return null
  }
}

export async function searchEmployeesByName(name: string) {
  const supabase = createServerSupabaseClient()

  try {
    const { data } = await supabase
      .schema("rtu_mirea")
      .rpc("search_employees_by_name", {
        _name: name,
      })
      .throwOnError()

    return data
  } catch (error) {
    console.error("[searchEmployeeByName] Error:", error)
    return null
  }
}

export async function getStudentById(id: string) {
  const supabase = createServerSupabaseClient()

  try {
    const { data } = await supabase
      .schema("rtu_mirea")
      .from("students")
      .select("*")
      .eq("id", id)
      .single()
      .throwOnError()
    return data
  } catch (error) {
    console.error("[getStudentById] Error:", error)
    return null
  }
}

export async function getStudentDebtsById(id: string) {
  const supabase = createServerSupabaseClient()

  try {
    const { data } = await supabase
      .schema("rtu_mirea")
      .from("debts_disciplines")
      .select("*")
      .eq("student_uuid", id)
      .throwOnError()

    return data
  } catch (error) {
    console.error("[getStudentDebtsById] Error:", error)
    return null
  }
}

export async function getStudentRetakesById(id: string) {
  const supabase = createServerSupabaseClient()

  try {
    const { data: debtsDisciplines } = await supabase
      .schema("rtu_mirea")
      .from("debts_disciplines")
      .select("*")
      .eq("student_uuid", id)
      .throwOnError()

    if (!debtsDisciplines) return null

    const retakes = await Promise.all(
      debtsDisciplines.map(async (discipline) => {
        try {
          const { data } = await supabase
            .schema("rtu_mirea")
            .from("retakes")
            .select("*")
            .eq("discipline", discipline.name)
            .order("date", { ascending: true })
            // Only active retakes
            .filter("date", "gte", new Date().toISOString())
            .throwOnError()
          return data ?? []
        } catch (error) {
          console.error("[getAllRetakesByDebtsDisciplines] Error:", error)
          return []
        }
      })
    )

    return retakes.flat().filter((retake) => retake !== null)
  } catch (error) {
    console.error("[getStudentRetakesById] Error:", error)
    return null
  }
}

export async function getUniqueGroupsByDepartment(department: string) {
  const supabase = createServerSupabaseClient()
  try {
    const { data } = await supabase
      .schema("rtu_mirea")
      .rpc("get_unique_academic_groups_by_department", {
        _department: department,
      })
      .throwOnError()
    return data as unknown as string[]
  } catch (error) {
    console.error("[getUniqueGroupsByDepartment] Error:", error)
    return null
  }
}

