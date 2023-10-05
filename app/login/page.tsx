"use client"

import Image from "next/image"
import Link from "next/link"

import { useSupabase } from "@/lib/supabase/supabase-provider"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

import Messages from "./messages"

export default function Login() {
  const { supabase } = useSupabase()

  return (
    <>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Вход в систему
            </h1>
            <p className="text-sm text-muted-foreground">
              Чтобы продолжить, войдите через единую систему аутентификации РТУ
              МИРЭА.
            </p>
          </div>

          <Button
            variant="outline"
            type="button"
            onClick={() => {
              supabase.auth.signInWithOAuth({
                // @ts-ignore
                provider: "mirea",
                options: {
                  redirectTo: `${process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL}/auth/callback`,
                },
              })
            }}
          >
            <Image
              src={"/gerb.png"}
              width={24}
              height={24}
              alt="logo"
              className="mr-2"
            />
            Войти
          </Button>
        </div>
      </div>
    </>
  )
}
