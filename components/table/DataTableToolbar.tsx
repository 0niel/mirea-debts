"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { DataTableFacetedFilter } from "./DataTableFacetedFilter"
import { DataTableViewOptions } from "./DataTableViewOptions"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  onFilter?: (value: string) => void
  facetedFilters?: {
    label: string
    column: string
    options: {
      label: string
      value: string
      icon?: React.ComponentType<{ className?: string }>
    }[]
  }[]
  onFacetedFilterChange?: (column: string, selectedOptions: string[]) => void
  department: string
}

export function DataTableToolbar<TData>({
  table,
  onFilter,
  facetedFilters,
  onFacetedFilterChange,
  department,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Фильтр..."
          onChange={(event: { currentTarget: { value: string } }) => {
            onFilter && onFilter(event.currentTarget.value)
            table.setGlobalFilter(event.currentTarget.value)
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {facetedFilters?.map((filter) => (
          <DataTableFacetedFilter
            key={filter.column}
            column={table.getColumn(filter.column)}
            title={filter.label}
            options={filter.options}
            setSelectedOptions={(selectedOptions) => {
              onFacetedFilterChange &&
                onFacetedFilterChange(filter.column, selectedOptions)
            }}
          />
        ))}

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
      <DataTableViewOptions table={table} department={department} />
    </div>
  )
}
