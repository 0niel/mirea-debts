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
  retake,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  retake: Database["rtu_mirea"]["Tables"]["retakes"]["Insert"] | null
}) {
  const { supabase } = useSupabase()
  const { toast } = useToast()
  const router = useRouter()

  const [notificationsState, setNotificationsState] =
    useState<NotificationRealtimeState | null>(null)

  const getChannelName = () => {
    if (!retake) throw new Error("Retake is not defined")

    return retake.discipline
  }

  useEffect(() => {
    if (!retake) return

    const channel = supabase.channel(getChannelName()).subscribe()

    channel.on(
      "broadcast",
      {
        event: "sync",
      },
      (payload) => {
        const state = payload["payload"] as NotificationRealtimeState
        setNotificationsState(state)
      }
    )
  }, [retake, supabase])

  const handleSubmit = async () => {
    if (!retake) return

    const { error } = await supabase
      .schema("rtu_mirea")
      .from("retakes")
      .insert(retake)

    if (error) {
      toast({
        variant: "destructive",
        title: "ОЙ! Что-то пошло не так.",
        description: "Произошла ошибка при создании пересдачи.",
      })

      console.error(error)
      return
    }

    toast({
      title: "Успешно!",
      description: "Пересдача успешно создана.",
    })

    fetch("/api/messengers/send-notifications", {
      method: "POST",
      body: JSON.stringify({
        retake: retake,
      }),
    })
  }

  useEffect(() => {
    if (!notificationsState) return

    if (notificationsState.state === "finished") {
      if (retake) {
        const channel = supabase.channel(getChannelName()).subscribe()

        channel.unsubscribe()
      }

      setOpen(false)

      router.push("/dashboard")
    }
  }, [notificationsState, supabase, retake])

  return (
    <Dialog open={open}>
      {!notificationsState && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Создать пересдачу?</DialogTitle>
            <DialogDescription>
              <span>
                Вы уверены, что хотите создать пересдачу по предмету{" "}
                {retake?.discipline} на {retake?.date} в {retake?.time_start}?
              </span>
              <br />
              <span> Мы разошлём уведомления студентам о новой пересдаче.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setOpen(false)} variant="secondary">
              Отмена
            </Button>
            <Button onClick={handleSubmit}>Создать</Button>
          </DialogFooter>
        </DialogContent>
      )}

      {notificationsState && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Рассылка уведомлений</DialogTitle>
            <DialogDescription>
              Мы рассылаем уведомления для {notificationsState.total} студентов.
              Страница автоматически перезагрузкится, когда рассылка закончится.
            </DialogDescription>
          </DialogHeader>
          <Progress
            value={notificationsState.notified}
            max={notificationsState.total}
          />
        </DialogContent>
      )}
    </Dialog>
  )
}
