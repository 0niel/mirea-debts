"use client"

import plural from "plural-ru"

import { Database } from "@/lib/supabase/db-types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type Debts = Database["rtu_mirea"]["Tables"]["debts_disciplines"]["Row"][]

export default function DebtsCard({ debts }: { debts: Debts }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Твои задолженности</CardTitle>
        {debts.length ? (
          <CardDescription>
            Сейчас у вас {debts.length}{" "}
            {plural(
              debts.length,
              "задолженность",
              "задолженности",
              "задолженностей"
            )}
          </CardDescription>
        ) : (
          <></>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {debts.length ? (
            debts.map((debt) => (
              <div key={debt.id}>
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {debt.name}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex h-64 w-full flex-col items-center justify-center">
              <p className="text-xl font-semibold text-muted-foreground">
                Нет задолженностей!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
