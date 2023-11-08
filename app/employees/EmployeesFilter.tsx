"use client"

import { useState } from "react"
import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function EmployeesFilter({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string
  setSearchQuery: (value: string) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Поиск..."
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(event.target.value)
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {searchQuery && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearchQuery("")
            }}
            className="h-8 px-2 lg:px-3"
          >
            Сбросить
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
