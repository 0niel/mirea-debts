"use client"

import * as React from "react"
import { DialogProps } from "@radix-ui/react-alert-dialog"
import { LaptopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { SelectTrigger } from "@radix-ui/react-select"
import { useTheme } from "next-themes"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select"

import { Button } from "./ui/button"

export function ThemeCommandMenu({ ...props }: DialogProps) {
  const { theme, setTheme } = useTheme()

  const runCommand = React.useCallback((command: () => unknown) => {
    command()
  }, [])

  return (
    <Select
      onValueChange={(value) => runCommand(() => setTheme(value))}
      defaultValue={theme ?? "system"}
    >
      <SelectTrigger asChild>
        <Button variant="ghost" className="h-9 w-9 px-0">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Выберите тему</span>
        </Button>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Тема</SelectLabel>
          <SelectItem value="light">
            <span className="flex flex-row items-center">
              <SunIcon className="mr-2 h-4 w-4" />
              <span>Светлая</span>
            </span>
          </SelectItem>
          <SelectItem value="dark">
            <span className="flex flex-row items-center">
              <MoonIcon className="mr-2 h-4 w-4" />
              <span>Тёмная</span>
            </span>
          </SelectItem>
          <SelectItem value="system">
            <span className="flex flex-row items-center">
              <LaptopIcon className="mr-2 h-4 w-4" />
              <span>Как в системе</span>
            </span>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
