"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { NotificationRealtimeState } from "@/lib/notification-realtime-state"
import { Database } from "@/lib/supabase/db-types"
import { useSupabase } from "@/lib/supabase/supabase-provider"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"

export function ConfirmationDialog({
  open,
  setOpen,
  retakes,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  retakes: Database["rtu_mirea"]["Tables"]["retakes"]["Insert"][] | null
}) {
  const { supabase } = useSupabase()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async () => {
    if (!retakes) return

    const res = await Promise.all(
      retakes.map((retake) => {
        return supabase.schema("rtu_mirea").from("retakes").insert(retake)
      })
    )

    if (res.some((r) => r.error)) {
      toast({
        variant: "destructive",
        title: "ОЙ! Что-то пошло не так.",
        description: "Произошла ошибка при создании пересдачи.",
      })

      console.error(res)
      return
    }

    Promise.all(
      retakes.map(async (retake) => {
        return await fetch("/api/messengers/send-notifications", {
          method: "POST",
          body: JSON.stringify({
            retake: retake,
          }),
        })
      })
    )

    toast({
      title: "Успешно!",
      description: "Пересдача успешно создана.",
    })

    await new Promise((resolve) => setTimeout(resolve, 1500))

    setOpen(false)

    router.push("/dashboard")
  }

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать пересдачу?</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Вы уверены, что хотите создать пересдачу по предметам:
          </p>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            {retakes?.map((retake) => (
              <li
                key={retake.discipline}
                className="text-sm font-medium text-gray-900"
              >
                {retake.discipline},
              </li>
            ))}
          </ul>

          <p className="text-sm text-gray-500">
            Пересдача будет назначена на {retakes?.[0].date} в{" "}
            {retakes?.[0].time_start}.
          </p>

          <p className="text-sm text-gray-500">
            Мы разошлём уведомления студентам о новой пересдаче.
          </p>
        </div>
        <DialogFooter>
          <Button onClick={() => setOpen(false)} variant="secondary">
            Отмена
          </Button>
          <Button onClick={handleSubmit}>Создать</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
