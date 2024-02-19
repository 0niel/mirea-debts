"use client"

import { useEffect, useState } from "react"
import { Transition } from "@headlessui/react"
import { useQuery } from "@tanstack/react-query"
import plural from "plural-ru"

import { Database } from "@/lib/supabase/db-types"
import { useSupabase } from "@/lib/supabase/supabase-provider"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"

import { Employee } from "./Employee"
import { EmployeesFilter } from "./EmployeesFilter"
import { EmployeesPagination } from "./EmployeesPagination"

type Employee = Database["rtu_mirea"]["Tables"]["employees"]["Row"]
type Profile = Database["rtu_mirea"]["Tables"]["profiles"]["Row"]
type ExtendedPermission =
  Database["rtu_mirea"]["Tables"]["extended_permissions"]["Row"]

export function EmployeesList({
  department,
  employeesCount,
}: {
  department: string
  employeesCount: number
}) {
  const { supabase } = useSupabase()

  const [unauthorizedEmployeesCount, setUnauthorizedEmployeesCount] =
    useState(0)

  const [count, setCount] = useState(employeesCount)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [searchQuery, setSearchQuery] = useState("")

  const {
    data: employees,
    error,
    isLoading,
  } = useQuery(
    ["employees", page, pageSize, searchQuery],
    async () => {
      let employees

      if (!searchQuery) {
        const { data } = (await supabase
          .schema("rtu_mirea")
          .from("employees")
          .select("*")
          .eq("department", department)
          .order("user_id", { ascending: true })
          .order("post", { ascending: true })
          .range((page - 1) * pageSize, page * pageSize - 1)
          .throwOnError()) as unknown as { data: Employee[] }

        employees = data ?? []
      } else {
        if (searchQuery.length < 3) return []
        const { data } = await supabase
          .schema("rtu_mirea")
          .rpc("search_employees_by_name", {
            _name: searchQuery,
          })
          .throwOnError()

        employees = data ?? []
      }

      const profiles = (
        await Promise.all(
          employees
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
        )
      ).map((res) => res.data) as Profile[]

      const res = employees.map((employee) => {
        return {
          ...employee,
          profile: profiles.find((profile) => profile.id === employee.user_id),
        }
      })

      const { count } = await supabase
        .schema("rtu_mirea")
        .from("employees")
        .select("id", { count: "exact", head: true })
        .eq("department", department)

      setCount(count ?? 0)
      setUnauthorizedEmployeesCount(
        employeesCount - res.filter((employee) => employee.user_id).length
      )

      return res.sort((a, b) => {
        if (!a.profile || !b.profile) return 0

        return a.profile.first_name.localeCompare(b.profile.first_name)
      })
    },
    {
      enabled: !!department,
      refetchOnWindowFocus: false,
    }
  )

  useEffect(() => {
    setPage(1)
  }, [pageSize])

  return (
    <>
      <EmployeesFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <ScrollArea className="mt-4">
        <div className="flex flex-col space-y-4">
          <ScrollBar orientation="horizontal" />

          {isLoading &&
            Array.from({ length: pageSize }).map((_, i) => (
              <div
                key={i}
                className="flex flex-row items-center justify-between"
              >
                <Skeleton key={i} className="h-10 w-80" />
                <Skeleton key={i} className="h-10 w-24" />
              </div>
            ))}

          {!isLoading &&
            employees?.map((employee) => (
              <Employee key={employee.id} employee={employee} />
            ))}

          {unauthorizedEmployeesCount > 0 && (
            <p className="text-sm text-muted-foreground">
              {unauthorizedEmployeesCount}{" "}
              {plural(
                unauthorizedEmployeesCount,
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
      </ScrollArea>
    </>
  )
}
