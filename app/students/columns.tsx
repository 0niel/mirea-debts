"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"

import { Database } from "@/lib/supabase/db-types"
import { useSupabase } from "@/lib/supabase/supabase-provider"
import { Skeleton } from "@/components/ui/skeleton"
import { DataTableColumnHeader } from "@/components/table/DataTableColumnHeader"

const StudentDebts = ({ row }: { row: any }) => {
  const { supabase } = useSupabase()

  const { data, error, isLoading } = useQuery(
    ["debts_disciplines", row.getValue("id")],
    async () => {
      const { data } = await supabase
        .schema("rtu_mirea")
        .from("debts_disciplines")
        .select("name")
        .eq("student_uuid", row.getValue("id"))

      return data ?? []
    },
    {
      refetchOnWindowFocus: false,
    }
  )
  return (
    <div className="flex flex-col space-y-2">
      {isLoading ? (
        <Skeleton className="w-[300px]" />
      ) : (
        data?.map((debt: any) => (
          <span className="truncate font-medium">{debt.name}</span>
        ))
      )}
    </div>
  )
}

export const columns: ColumnDef<
  Database["rtu_mirea"]["Tables"]["students"]["Row"] & {
    debts_disciplines: string[]
  }
>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }) => (
      <div className="w-[300px]">
        <Link
          href={`/students/${row.getValue("id")}`}
          className="cursor-pointer"
          target="_blank"
        >
          <span className="truncate font-medium text-blue-500">
            {row.getValue("id")}
          </span>
        </Link>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "academic_group",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Группа" />
    ),
    cell: ({ row }) => {
      return (
        <span className="truncate font-medium">
          {row.getValue("academic_group")}
        </span>
      )
    },
  },
  {
    accessorKey: "last_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Фамилия" />
    ),
    cell: ({ row }) => {
      return (
        <span className="truncate font-medium">
          {row.getValue("last_name")}
        </span>
      )
    },
  },
  {
    accessorKey: "first_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Имя" />
    ),
    cell: ({ row }) => {
      return (
        <span className="truncate font-medium">
          {row.getValue("first_name")}
        </span>
      )
    },
  },

  {
    accessorKey: "second_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Отчество" />
    ),
    cell: ({ row }) => {
      return (
        <span className="truncate font-medium">
          {row.getValue("second_name")}
        </span>
      )
    },
  },
  {
    accessorKey: "personal_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Студенческий" />
    ),
    cell: ({ row }) => {
      return (
        <span className="truncate font-medium">
          {row.getValue("personal_number")}
        </span>
      )
    },
  },
  {
    accessorKey: "institute",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Институт" />
    ),
    cell: ({ row }) => {
      return (
        <span className="truncate font-medium">
          {row.getValue("institute")}
        </span>
      )
    },
  },
  {
    accessorKey: "debts_disciplines",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Задолженности" />
    ),

    cell: ({ row }) => {
      return <StudentDebts row={row} />
    },
  },
]
