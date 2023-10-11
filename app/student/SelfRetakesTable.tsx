"use client"

import { QuestionMarkCircledIcon } from "@radix-ui/react-icons"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Database } from "@/lib/supabase/db-types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function SelfRetakesTable({
  retakes,
}: {
  retakes: Database["rtu_mirea"]["Tables"]["retakes"]["Row"][]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ваши пересдачи</CardTitle>
        <CardDescription>
          Список актуальный пересдач для ваших академических задолженностей.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {retakes.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Предмет</TableHead>
                <TableHead>Описание</TableHead>
                <TableHead>Онлайн?</TableHead>
                <TableHead>Ссылка/аудитория</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Время начала</TableHead>
                <TableHead>Время окончания</TableHead>
                <TableHead>Преподаватели</TableHead>
                <TableHead className="flex w-[100px] items-center justify-center space-x-2">
                  <p>Допуск</p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <QuestionMarkCircledIcon className="h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent className="w-[200px] text-sm">
                        <p>
                          Если отмечено, что нужен допуск, то необходимо
                          получить ведомость или допуск в учебном отделе вашего
                          института.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {retakes?.map((retake) => (
                <TableRow key={retake.id}>
                  <TableCell>{retake.discipline}</TableCell>
                  <TableCell>{retake.description}</TableCell>
                  <TableCell>{retake.is_online ? "Да" : "Нет"}</TableCell>
                  <TableCell>{retake.place}</TableCell>
                  <TableCell>
                    {retake.date.split("-").reverse().join(".")}
                  </TableCell>
                  <TableCell>
                    {retake.time_start.split(":").slice(0, 2).join(":")}
                  </TableCell>
                  <TableCell>
                    {retake.time_end.split(":").slice(0, 2).join(":")}
                  </TableCell>
                  <TableCell>{retake.teachers}</TableCell>
                  <TableCell>
                    {retake.need_statement ? "Нужен" : "Не нужен"}
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
  )
}
