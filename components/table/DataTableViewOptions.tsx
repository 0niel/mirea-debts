"use client"

import Link from "next/link"
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { DownloadIcon, MixerHorizontalIcon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
  department: string
}

export function DataTableViewOptions<TData>({
  table,
  department,
}: DataTableViewOptionsProps<TData>) {
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        formTarget="_blank"
        className="mr-4 hidden h-8 lg:flex"
      >
        <DownloadIcon className="mr-2 h-4 w-4" />
        <Link href={`/api/export?department=${department}`}>Экспорт</Link>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto hidden h-8 lg:flex"
          >
            <MixerHorizontalIcon className="mr-2 h-4 w-4" />
            Просмотр
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuLabel>Включение колонок</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide()
            )
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              )
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
