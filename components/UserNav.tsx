import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"

import { getSession, getUserDepartment } from "@/lib/supabase/supabase-server"
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

export async function UserNav() {
  const session = await getSession()

  const department = await getUserDepartment(session?.user.id ?? "")

  const getInitialsName = () => {
    try {
      return (
        session?.user?.user_metadata["name"][0] +
        " " +
        session?.user?.user_metadata["family_name"][0]
      )
    } catch {
      return ""
    }
  }

  const signOut = async (formData: FormData) => {
    "use server"

    const supabase = createServerActionClient({ cookies })

    await supabase.auth.signOut()

    redirect("/")
  }

  return session?.user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{getInitialsName()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <form action={signOut}>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user?.user_metadata.name}{" "}
                {session.user?.user_metadata.family_name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {department ?? ""}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <button
              type="submit"
              className="flex w-full flex-row items-center justify-between"
            >
              Выйти
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Link href="/login">
      <Button variant="outline">Войти</Button>
    </Link>
  )
}
