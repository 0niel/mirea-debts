import { User } from "@supabase/supabase-js"
import { useQuery } from "@tanstack/react-query"
import plural from "plural-ru"

import { Database } from "@/lib/supabase/db-types"
import { useSupabase } from "@/lib/supabase/supabase-provider"
import { getProfile, getRecentRetakes } from "@/lib/supabase/supabase-server"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "../../components/ui/table"

type Profile = Database["rtu_mirea"]["Tables"]["profiles"]["Row"]

type Retake = Database["rtu_mirea"]["Tables"]["retakes"]["Row"] & {
  creator: {
    profile: Profile
  }
}

export async function RecentActivity() {
  const recentActivity = await getRecentRetakes()

  const uniqueUserIds = recentActivity
    ?.map((retake) => retake.creator_id)
    .filter((id, index, self) => self.indexOf(id) === index)

  const profiles = await Promise.all(
    uniqueUserIds?.map((id) => {
      return getProfile(id)
    }) ?? []
  )

  const data = recentActivity?.map((retake) => ({
    ...retake,
    creator: profiles?.find((profile) => profile?.id === retake.creator_id),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Последняя активность</CardTitle>
        <CardDescription>
          За последний месяц назначено {recentActivity?.length || 0}{" "}
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
            {data?.map((retake) => (
              <TableRow key={retake.id}>
                <TableCell>
                  <div className="flex items-start">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>
                        {retake.creator?.first_name[0]}
                        {retake.creator?.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {retake.creator?.first_name} {retake.creator?.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {retake.creator?.email}
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
