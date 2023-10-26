"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

import { useSupabase } from "@/lib/supabase/supabase-provider"
import { UserPermissionsManager } from "@/lib/user-permissions-manager"
import { cn } from "@/lib/utils"

export function HeaderNavbar({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathName = usePathname()!

  const checkPath = (path: string) => pathName.startsWith(path)

  const isDashboardPage = checkPath("/dashboard")
  const isAddPage = checkPath("/add")
  const isEditPage = checkPath("/edit")
  const isEmployeesPage = checkPath("/employees")

  const { supabase } = useSupabase()

  const { data } = useQuery(["user"], () => supabase.auth.getUser(), {
    staleTime: Infinity,
  })

  const [permissions, setPermissions] = useState<UserPermissionsManager>()

  useEffect(() => {
    if (data?.data.user) {
      const permissionsManager = new UserPermissionsManager(data.data.user)
      setPermissions(permissionsManager)
    }
  }, [data])

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Image src="/gerb.png" alt="Logo" width={40} height={40} />
      <Link
        href={permissions?.isEmployee() ? "/dashboard" : "/student"}
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          {
            "text-muted-foreground": !isDashboardPage,
          }
        )}
      >
        Обзор
      </Link>
      {permissions?.isEmployee() && (
        <Link
          href="/add"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            {
              "text-muted-foreground": !isAddPage,
            }
          )}
        >
          Создание
        </Link>
      )}
      {permissions?.isEmployee() && (
        <Link
          href="/employees"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            {
              "text-muted-foreground": !isEmployeesPage,
            }
          )}
        >
          Создание
        </Link>
      )}
    </nav>
  )
}
