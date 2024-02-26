"use client"

import React from "react"
import { useQuery } from "@tanstack/react-query"
import { User2Icon } from "lucide-react"

import { Database } from "@/lib/supabase/db-types"
import { useSupabase } from "@/lib/supabase/supabase-provider"
import { Skeleton } from "@/components/ui/skeleton"
import { DataTable } from "@/components/table/DataTable"

import { columns } from "./columns"

type Student = Database["rtu_mirea"]["Tables"]["students"]["Row"]

export default function StudentsTable({
  availableGroups,
  availableDisciplines,
  department,
}: {
  availableGroups: string[]
  availableDisciplines: string[]
  // Если не указано, то будут показаны все студенты
  department?: string
}) {
  const { supabase } = useSupabase()

  const groupsFacetedFilter = availableGroups.map((group) => ({
    label: group,
    value: group,
    icon: User2Icon,
  }))

  const disciplinesFacetedFilter = availableDisciplines.map((discipline) => ({
    label: discipline,
    value: discipline,
    icon: undefined,
  }))

  const [selectedGroups, setSelectedGroups] = React.useState<string[]>([])
  const [selectedDisciplines, setSelectedDisciplines] = React.useState<
    string[]
  >([])

  const [count, setCount] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const [searchQuery, setSearchQuery] = React.useState("")

  const getCount = async () => {
    const { data } = await supabase
      .schema("rtu_mirea")
      .rpc("search_students_count", {
        _department: department ?? undefined,
        _academic_groups:
          selectedGroups.length > 0 ? selectedGroups : undefined,
        _debts_disciplines:
          selectedDisciplines.length > 0 ? selectedDisciplines : undefined,
        _name: searchQuery.length > 0 ? searchQuery : undefined,
      })
      .throwOnError()
    setCount(data ?? 0)
  }

  const { data, error, isLoading } = useQuery(
    [
      "students",
      availableGroups,
      availableDisciplines,
      selectedGroups,
      selectedDisciplines,
      searchQuery,
    ],
    async () => {
      const { data } = await supabase
        .schema("rtu_mirea")
        .rpc("search_students", {
          _limit: pageSize,
          _offset: (page - 1) * pageSize,
          _department: department ?? undefined,
          _academic_groups:
            selectedGroups.length > 0 ? selectedGroups : undefined,
          _debts_disciplines:
            selectedDisciplines.length > 0 ? selectedDisciplines : undefined,
          _name: searchQuery.length > 0 ? searchQuery : undefined,
        })
        .throwOnError()

      await getCount()

      return (data ?? [])
        .filter((student) => student)
        .map((student) => ({
          ...student,
          debts_disciplines: [],
        }))
    },
    {
      refetchOnWindowFocus: false,
    }
  )

  return isLoading ? (
    <Skeleton className="w-[300px]" />
  ) : (
    <DataTable
      data={data ?? []}
      department={department!}
      columns={columns}
      onFilter={(value) => {
        setSearchQuery(value)
      }}
      facetedFilters={[
        {
          label: "Группа",
          column: "academic_group",
          options: groupsFacetedFilter,
        },
        {
          label: "Дисциплины",
          column: "debts_disciplines",
          options: disciplinesFacetedFilter,
        },
      ]}
      onFacetedFilterChange={(column, selectedOptions) => {
        if (column === "academic_group") {
          setSelectedGroups(selectedOptions)
        } else if (column === "debts_disciplines") {
          setSelectedDisciplines(selectedOptions)
        }
      }}
      tableOptions={{
        manualPagination: true,
        pageCount: Math.ceil(count / pageSize),
      }}
    />
  )
}
