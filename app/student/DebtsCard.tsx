"use client"

import { useQuery } from "@tanstack/react-query"
import axios from "axios"

import { Database } from "@/lib/supabase/db-types"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type Debts = Database["rtu_mirea"]["Tables"]["debts_disciplines"]["Row"][]

export default function DebtsCard({ debts }: { debts: Debts }) {
  // const { data } = useQuery([debts], async () => {
  //   // fetch https://online-edu.mirea.ru/group-page/table_generation.php with ИКБО-30-20 as group_name form data
  //   const response = await axios.post(
  //     "https://online-edu.mirea.ru/group-page/table_generation.php",
  //     {
  //       // form data
  //       group_name: "ИКБО-30-20",
  //       headers: {
  //         Origin: "https://online-edu.mirea.ru",
  //         Referer: "https://online-edu.mirea.ru/group-page/",
  //       },
  //     }
  //   )

  //   const text = await response.text()

  //   console.log(text)

  //   // Response Example:
  //   //   <tr>
  //   //   <th>ИКБО-30-20</th>
  //   //   <th>1</th>
  //   //   <th>Введение в профессиональную деятельность_52</th>
  //   //   <th>
  //   //       <a href='https://online-edu.mirea.ru/course/view.php?id=4046'>
  //   //           <img width=50 src='/group-page/assets/img/link.png' border=0 title='Перейти в дисциплину'>
  //   //       </a>
  //   //   </th>
  //   //   <th>ИИТ / Кафедра инструментального и прикладного программного обеспечения</th>
  //   // </tr>

  //   // Parse table from response and get names of disciplines with url:
  //   const parser = new DOMParser()

  //   const parsed = parser.parseFromString(text, "text/html")

  //   const rows = parsed.querySelectorAll("tr")

  //   console.log(rows)

  //   const disciplines = Array.from(rows).map((row) => ({
  //     name: row.children[2].textContent,
  //     url: row.querySelector("a")?.href,
  //   }))

  //   console.log(disciplines)

  //   return disciplines
  // })

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Ваши задолженности</CardTitle>
        {debts.length && (
          <CardDescription>
            Сейчас у вас {debts.length} задолженностей.
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {debts.length ? (
            debts.map((debt) => (
              <>
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {debt.name}
                    </p>
                    {/* <p className="text-sm text-muted-foreground">
                      olivia.martin@email.com
                    </p> */}
                  </div>
                </div>
                {/* <div className="ml-auto font-medium">+$1,999.00</div> */}
              </>
            ))
          ) : (
            <div className="flex h-64 w-full flex-col items-center justify-center">
              <p className="text-xl font-semibold text-muted-foreground">
                Нет задолженностей
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
