"use client"

import * as React from "react"
import { DialogProps } from "@radix-ui/react-alert-dialog"
import { LaptopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "./ui/button"

export function ThemeCommandMenu({ ...props }: DialogProps) {
  const { setTheme } = useTheme()

  const runCommand = React.useCallback((command: () => unknown) => {
    command()
  }, [])

  return (
    <>
      {" "}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-9 px-0">
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Выберите тему</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <Command>
            <CommandList>
              <CommandGroup heading="Тема">
                <CommandItem
                  onSelect={() => runCommand(() => setTheme("light"))}
                >
                  <SunIcon className="mr-2 h-4 w-4" />
                  Светлая
                </CommandItem>
                <CommandItem
                  onSelect={() => runCommand(() => setTheme("dark"))}
                >
                  <MoonIcon className="mr-2 h-4 w-4" />
                  Тёмная
                </CommandItem>
                <CommandItem
                  onSelect={() => runCommand(() => setTheme("system"))}
                >
                  <LaptopIcon className="mr-2 h-4 w-4" />
                  Как в системе
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
