"use client"

import { useQuery } from "@tanstack/react-query"

import { useSupabase } from "@/lib/supabase/supabase-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserNav() {
  const { supabase } = useSupabase()

  const { data } = useQuery(["user"], () => supabase.auth.getUser(), {
    staleTime: Infinity,
  })

  const getInitialsName = () => {
    try {
      return (
        data?.data.user?.user_metadata["name"][0] +
        " " +
        data?.data.user?.user_metadata["family_name"][0]
      )
    } catch {
      return ""
    }
  }

  return (
    data?.data.user && (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{getInitialsName()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {data?.data.user?.user_metadata.name}{" "}
                {data?.data.user?.user_metadata.family_name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {data?.data.user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              supabase.auth.signOut().then(() => {
                window.location.reload()
              })
            }}
          >
            Выйти
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  )
}
