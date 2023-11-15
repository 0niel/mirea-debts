"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Database } from "@/lib/supabase/db-types"
import { DataTableColumnHeader } from "@/components/table/DataTableColumnHeader"

export const columns: ColumnDef<
  Database["rtu_mirea"]["Tables"]["students"]["Row"]
>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }) => <div className="w-[300px]">{row.getValue("id")}</div>,
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
]
