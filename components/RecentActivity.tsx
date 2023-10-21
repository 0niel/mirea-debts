"use client"

import { ScrollArea } from "@radix-ui/react-scroll-area"
import { User } from "@supabase/supabase-js"
import { useQuery } from "@tanstack/react-query"
import plural from "plural-ru"

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
import { Table, TableBody, TableCell, TableRow } from "./ui/table"

export function RecentActivity() {
  const { supabase } = useSupabase()

  const { data: recentActivity, isLoading } = useQuery(
    ["recentActivity"],
    async () => {
      const { data } = await supabase
        .schema("rtu_mirea")
        .from("retakes")
        .select("*")
        .order("created_at", { ascending: false })
        // Last 30 days
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
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
    }
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Последняя активность</CardTitle>
        <CardDescription>
          В этом месяце было назначено {recentActivity?.length || 0}{" "}
          {plural(
            recentActivity?.length || 0,
            "пересдача",
            "пересдачи",
            "пересдач"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-72 overflow-y-scroll">
        <Table>
          <TableBody>
            {recentActivity?.map((retake) => (
              <TableRow key={retake.id}>
                <TableCell>
                  <div className="flex items-start">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>
                        {retake.creator?.user.user_metadata.name[0]}
                        {retake.creator?.user.user_metadata.family_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {retake.creator?.user.user_metadata.name}{" "}
                        {retake.creator?.user.user_metadata.family_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {retake.creator?.user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="ml-auto min-w-[200px] leading-none sm:ml-6">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
