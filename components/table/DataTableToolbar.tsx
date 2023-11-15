"use client"

import {
  CircleIcon,
  Cross2Icon,
  QuestionMarkCircledIcon,
} from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { DataTableViewOptions } from "./DataTableViewOptions"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  onFilter?: (value: string) => void
}

export function DataTableToolbar<TData>({
  table,
  onFilter,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      {onFilter && (
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Фильтр..."
            onChange={(event) => {
              onFilter && onFilter(event.currentTarget.value)
              table.setGlobalFilter(event.currentTarget.value)
            }}
            className="h-8 w-[150px] lg:w-[250px]"
          />
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              Сброс
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      )}
      <DataTableViewOptions table={table} />
    </div>
  )
}
