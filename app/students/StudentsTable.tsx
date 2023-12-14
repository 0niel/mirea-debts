"use client"

import React from "react"
import { useQuery } from "@tanstack/react-query"
import { User2Icon } from "lucide-react"

import { useSupabase } from "@/lib/supabase/supabase-provider"
import { Skeleton } from "@/components/ui/skeleton"
import { DataTable } from "@/components/table/DataTable"

import { columns } from "./columns"

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

  const [searchQuery, setSearchQuery] = React.useState("")

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
          _limit: 2000,
          _offset: 0,
          _department: department ?? undefined,
          _academic_groups:
            selectedGroups.length > 0 ? selectedGroups : undefined,
          _debts_disciplines:
            selectedDisciplines.length > 0 ? selectedDisciplines : undefined,
          _name: searchQuery.length > 0 ? searchQuery : undefined,
        })
        .throwOnError()
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

  const {
    data: length,
    error: lengthError,
    isLoading: lengthIsLoading,
  } = useQuery(
    ["length", availableGroups, availableDisciplines],
    async () => {
      const { data } = await supabase
        .schema("rtu_mirea")
        .rpc("get_debtors_count", {
          _department: department ?? undefined,
        })
        .throwOnError()

      return data
    },
    {
      refetchOnWindowFocus: false,
    }
  )

  return lengthIsLoading ? (
    <Skeleton className="w-[300px]" />
  ) : (
    <DataTable
      data={data ?? []}
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
        pageCount: Math.ceil(data?.length ?? 0 / 10),
      }}
    />
  )
}
