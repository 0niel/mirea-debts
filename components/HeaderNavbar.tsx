"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

import { useSupabase } from "@/lib/supabase/supabase-provider"
import { cn } from "@/lib/utils"

export function HeaderNavbar({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathName = usePathname()!

  const isCurrentPage = (path: string) => pathName.startsWith(path)

  const isDashboardPage = isCurrentPage("/dashboard")
  const isAddPage = isCurrentPage("/add")
  const isEditPage = isCurrentPage("/edit")

  const { supabase } = useSupabase()

  const { data } = useQuery(["user"], () => supabase.auth.getUser(), {
    staleTime: Infinity,
  })

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Image src="/gerb.png" alt="Logo" width={40} height={40} />
      <Link
        href={
          data?.data.user?.email?.includes("@mirea.ru")
            ? "/dashboard"
            : "/student"
        }
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          {
            "text-muted-foreground": !isDashboardPage,
          }
        )}
      >
        Обзор
      </Link>
      {data?.data.user?.email?.includes("@mirea.ru") && (
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
    </nav>
  )
}
