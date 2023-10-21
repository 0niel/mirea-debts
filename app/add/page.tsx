"use client"

import { useQuery } from "@tanstack/react-query"
import { ListIcon } from "lucide-react"

import { useSupabase } from "@/lib/supabase/supabase-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

import { CreationForm } from "./CreationForm"

export default function Add() {
  const { supabase } = useSupabase()

  const { data, error, isLoading } = useQuery(["disciplines"], async () => {
    const { data } = await supabase
      .schema("rtu_mirea")
      .rpc("get_unique_disciplines")
      .throwOnError()
    return data as unknown as string[]
  })

  const { data: user } = useQuery(["user"], () => supabase.auth.getUser(), {
    staleTime: Infinity,
  })

  return isLoading ? (
    <div className="flex h-full flex-col space-y-4 overflow-hidden">
      <Skeleton className="h-14 w-72" />

      <div className="space-y-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    </div>
  ) : (
    <>
      <Alert variant={data?.length ? "default" : "destructive"}>
        <ListIcon className="h-4 w-4" />
        <AlertTitle>
          {data?.length ? (
            <>Найдено {data?.length} дисциплин для вас</>
          ) : (
            <>Не найдено дисциплин для вас</>
          )}
        </AlertTitle>
        <AlertDescription>
          Мы отобразим вам только те дисциплины, которые закреплены за вашей
          кафедрой, основываясь на вашем подразделении «
          {user?.data.user?.user_metadata.custom_claims.employee.group_name}».
          Если вы не видите какую-то дисциплину, то обратитесь к администратору.
        </AlertDescription>
      </Alert>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Создание пересдачи
        </h2>
      </div>
      <div className="space-y-4">
        <CreationForm disciplines={data ?? []} />
      </div>
    </>
  )
}
