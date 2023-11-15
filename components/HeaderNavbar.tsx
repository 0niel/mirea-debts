"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

import { useSupabase } from "@/lib/supabase/supabase-provider"
import { UserPermissionsManager } from "@/lib/user-permissions-manager"
import { cn } from "@/lib/utils"

import { MobileNav } from "./MobileNav"

const studentLinks = [
  {
    href: "/student",
    title: "Обзор",
  },
]

const employeeLinks = [
  {
    href: "/dashboard",
    title: "Обзор",
  },
  {
    href: "/add",
    title: "Создание",
  },
  {
    href: "/employees",
    title: "Сотрудники",
  },
  {
    href: "/students",
    title: "Студенты",
  },
]

export function HeaderNavbar({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathName = usePathname()!

  const checkPath = (path: string) => pathName.startsWith(path)

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
      <div className="block sm:hidden">
        {permissions?.isEmployee() ? (
          <MobileNav links={employeeLinks} />
        ) : (
          <MobileNav links={studentLinks} />
        )}
      </div>
      <Image src="/gerb.png" alt="Logo" width={40} height={40} />

      <div className="hidden sm:flex sm:space-x-4 lg:space-x-6">
        {permissions?.isEmployee() &&
          employeeLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                {
                  "text-muted-foreground": !checkPath(item.href),
                }
              )}
            >
              {item.title}
            </Link>
          ))}

        {permissions?.isStudent() &&
          studentLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                {
                  "text-muted-foreground": !checkPath(item.href),
                }
              )}
            >
              {item.title}
            </Link>
          ))}
      </div>
    </nav>
  )
}
