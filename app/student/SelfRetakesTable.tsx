"use client"

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
