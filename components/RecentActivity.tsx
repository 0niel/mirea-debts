"use client"

import { ScrollArea } from "@radix-ui/react-scroll-area"
import { User } from "@supabase/supabase-js"
import { useQuery } from "@tanstack/react-query"

import { Database } from "@/lib/supabase/db-types"
import { useSupabase } from "@/lib/supabase/supabase-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"

export function RecentActivity() {
  const { supabase } = useSupabase()

  const { data: recentActivity, isLoading } = useQuery(
    ["retakes"],
    async () => {
      const { data } = await supabase
        .schema("rtu_mirea")
        .from("retakes")
        .select("*")
        .order("created_at", { ascending: false })
        .filter(
          "created_at",
          "gte",
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        )
        .limit(100)
        .throwOnError()

      const uniqueUserIds = data
        ?.map((retake) => retake.creator_id)
        .filter((id, index, self) => self.indexOf(id) === index)

      const users = await Promise.all(
        uniqueUserIds?.map(async (id) => {
          const userMetadataResponse = await fetch("/users?userId=" + id)
          const userMetadata = await userMetadataResponse.json()
          return userMetadata
        }) ?? []
      )

      const d = data?.map((retake) => ({
        ...retake,
        creator: users?.find((user) => user?.id === retake.creator_id),
      })) as unknown as (Database["rtu_mirea"]["Tables"]["retakes"]["Row"] & {
        creator: {
          user: User
        }
      })[]

      return d
    }
  )

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Последняя активность</CardTitle>
        <CardDescription>
          В этом месяце было назначено {recentActivity?.length} пересдач
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recentActivity?.map((retake) => (
            <div className="flex items-start" key={retake.id}>
              <Avatar className="h-9 w-9">
                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                <AvatarFallback>
                  {retake.creator.user.user_metadata.family_name[0]}
                  {retake.creator.user.user_metadata.name[0]}
                </AvatarFallback>
              </Avatar>

              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {retake.creator.user.user_metadata.name}{" "}
                  {retake.creator.user.user_metadata.family_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {retake.creator.user.email}
                </p>
              </div>
              <div>
                <div className="ml-auto leading-none sm:ml-6">
                  <p>
                    создал(а) пересдачу «{retake.discipline}» на{" "}
                    <span className="font-medium">
                      {retake.date.replace(/-/g, ".")} в {retake.time_start}
                    </span>
                  </p>
                  <p className="mt-1.5 text-sm leading-none text-muted-foreground">
                    {new Date(retake.created_at).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
