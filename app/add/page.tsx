import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import {
  getSession,
  getUniqueDisciplines,
} from "@/lib/supabase/supabase-server"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RecentActivity } from "@/components/RecentActivity"

import { CreationForm } from "./CreationForm"

export const dynamic = "force-dynamic"

export default async function Add() {
  const session = await getSession()

  if (!session?.user) redirect("/login")

  const disciplines = await getUniqueDisciplines()

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Создание пересдачи
        </h2>
      </div>
      <div className="space-y-4">
        <CreationForm disciplines={disciplines ?? []} />
      </div>
    </>
  )
}
