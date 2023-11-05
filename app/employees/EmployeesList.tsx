"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import plural from "plural-ru"

import { Database } from "@/lib/supabase/db-types"
import { useSupabase } from "@/lib/supabase/supabase-provider"

import { Employee } from "./Employee"
import { EmployeesPagination } from "./EmployeesPagination"

type Employee = Database["rtu_mirea"]["Tables"]["employees"]["Row"]
type Profile = Database["rtu_mirea"]["Tables"]["profiles"]["Row"]

export function EmployeesList({
  department,
  employeesCount,
}: {
  department: string
  employeesCount: number
}) {
  const { supabase } = useSupabase()

  const [count, setCount] = useState(employeesCount)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const {
    data: employees,
    error,
    isLoading,
  } = useQuery(["employees", page, pageSize], async () => {
    const { data } = (await supabase
      .schema("rtu_mirea")
      .from("employees")
      .select("*")
      .eq("department", department)
      .order("post", { ascending: false })
      .range(page - 1, pageSize)
      .throwOnError()) as unknown as { data: Employee[] }

    const profiles = (await Promise.all(
      data
        .filter((employee) => employee.user_id)
        .map((employee) => {
          return supabase
            .schema("rtu_mirea")
            .from("profiles")
            .select("*")
            .eq("id", employee.user_id!)
            .single()
            .throwOnError()
        })
    )) as unknown as Profile[]

    const res = data
      .filter((employee) => employee.user_id)
      .map((employee) => {
        return {
          ...employee,
          profile: profiles.find((profile) => profile.id === employee.user_id),
        }
      })

    setCount(res.length)

    return res
  })

  return (
    <div className="flex flex-col space-y-4">
      {employees?.map((employee) => (
        <Employee key={employee.id} employee={employee} />
      ))}

      {employeesCount - count > 0 && (
        <p className="text-muted-foreground">
          И ещё {employeesCount - count}{" "}
          {plural(
            employeesCount - count,
            "сотрудник",
            "сотрудника",
            "сотрудников"
          )}{" "}
          не авторизованы в системе
        </p>
      )}

      <EmployeesPagination
        count={count}
        page={page}
        pageSize={pageSize}
        setPage={setPage}
        setPageSize={setPageSize}
      />
    </div>
  )
}
