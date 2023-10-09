"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { useQuery } from "@tanstack/react-query"

import { Database } from "@/lib/supabase/db-types"
import { useSupabase } from "@/lib/supabase/supabase-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "../../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import { Skeleton } from "../../components/ui/skeleton"
import { toast, useToast } from "../../components/ui/use-toast"

export default function SelfRetakesTable() {
  const { supabase } = useSupabase()
  const { toast } = useToast()

  const { data: retakes, isLoading } = useQuery(
    ["selfCreatedRetakes"],
    async () => {
      const me = await supabase.auth.getUser()

      if (!me?.data.user?.id) return []

      const data = (
        await supabase
          .schema("rtu_mirea")
          .from("retakes")
          .select("*")
          .eq("creator_id", me.data.user.id)
          .order("created_at", { ascending: false })
          .limit(100)
          .throwOnError()
      ).data as unknown as Database["rtu_mirea"]["Tables"]["retakes"]["Row"][]

      console.log("Retakes: ", data)
      return data
    }
  )

  const handleDelete = async (retakeId: number) => {
    await supabase
      .schema("rtu_mirea")
      .from("retakes")
      .delete()
      .eq("id", retakeId)
      .single()

    toast({
      title: "Успешно удалено",
      description: `Пересдача по предмету ${
        retakes?.find((retake) => retake.id === retakeId)?.discipline
      } успешно удалена`,
    })

    window.location.reload()
  }

  return retakes ? (
    <Card>
      <CardHeader>
        <CardTitle>Ваши пересдачи</CardTitle>
        <CardDescription>
          Пересдачи, которые вы создали в системе
        </CardDescription>
      </CardHeader>

      <CardContent>
        {retakes.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Предмен</TableHead>
                <TableHead>Описание</TableHead>
                <TableHead>Онлайн?</TableHead>
                <TableHead>Ссылка/аудитория</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Время начала</TableHead>
                <TableHead>Время окончания</TableHead>
                <TableHead>Преподаватели</TableHead>
                <TableHead>Допуск</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {retakes?.map((retake) => (
                <TableRow key={retake.id}>
                  <TableCell>{retake.discipline}</TableCell>
                  <TableCell>{retake.description}</TableCell>
                  <TableCell>{retake.is_online ? "Да" : "Нет"}</TableCell>
                  <TableCell>{retake.place}</TableCell>
                  <TableCell>{retake.date}</TableCell>
                  <TableCell>{retake.time_start}</TableCell>
                  <TableCell>{retake.time_end}</TableCell>
                  <TableCell>{retake.teachers}</TableCell>
                  <TableCell>
                    {retake.need_statement ? "Нужен" : "Не нужен"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                        >
                          <DotsHorizontalIcon className="h-4 w-4" />
                          <span className="sr-only">Меню</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem
                          onClick={() => handleDelete(retake.id)}
                        >
                          Удалить
                          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground">Пока что пересдач нет!</p>
        )}
      </CardContent>
    </Card>
  ) : (
    <></>
  )
}
