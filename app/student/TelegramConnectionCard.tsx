"use client"

import Link from "next/link"
import { Link1Icon } from "@radix-ui/react-icons"
import { User } from "@supabase/supabase-js"

import { Database } from "@/lib/supabase/db-types"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import UnklinkSocialNetworkButton from "./UnklinkSocialNetworkButton"

export const dynamic = "force-dynamic"

export function TelegramConnectionCard({
  user,
  telegram,
}: {
  user: User
  telegram: Database["rtu_mirea"]["Tables"]["social_networks"]["Row"] | null
}) {
  const generateDeepLink = (payload: string) => {
    const url = `https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME}?start=${payload}`
    return url
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Уведомления в Телеграме</CardTitle>
        <CardDescription>
          {telegram ? (
            <>
              Вы привязали свой аккаунт к Телеграму и будете своевременно
              получать уведомления о новых пересдачах. <br />
              <span className="mt-2">
                Ваш аккаунт:{" "}
                <Link
                  href={`https://t.me/${telegram.username}`}
                  target="_blank"
                >
                  <Button variant={"link"}>@{telegram.username}</Button>
                </Link>
              </span>
            </>
          ) : (
            <>
              Вы можете привязать свой аккаунт, чтобы своевременно получать
              уведомления о новых пересдачах.
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!telegram && (
          <Dialog>
            <DialogTrigger>
              <Button className="px-3 shadow-none">
                <Link1Icon className="mr-2 h-4 w-4" />
                Привязать аккаунт
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Привязка аккаунта Телеграм</DialogTitle>
                <DialogDescription>
                  Перейдите по ссылке и откройте бота, чтобы привязать аккаунт
                  Telegram.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <a target="_blank" href={generateDeepLink(user.id)} rel="noopener noreferrer">
                  <Button className="px-3 shadow-none">Перейти к боту</Button>
                </a>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        {telegram && <UnklinkSocialNetworkButton />}
      </CardContent>
    </Card>
  )
}
