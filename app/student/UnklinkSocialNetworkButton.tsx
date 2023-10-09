"use client"

import { useSupabase } from "@/lib/supabase/supabase-provider"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export default function UnklinkSocialNetworkButton() {
  const { supabase } = useSupabase()
  const { toast } = useToast()

  async function handleUnlink() {
    const me = await supabase.auth.getUser()

    if (!me.data.user) {
      toast({
        title: "Произошла ошибка при отвязке аккаунта",
      })

      return
    }

    try {
      await supabase
        .schema("rtu_mirea")
        .from("social_networks")
        .delete()
        .match({ user_id: me.data?.user?.id ?? "" })
        .single()
        .throwOnError()

      toast({
        title: "Аккаунт успешно отвязан",
      })

      window.location.reload()
    } catch (error) {
      console.error(error)
      toast({
        title: "Произошла ошибка при отвязке аккаунта",
      })

      return
    }

    window.location.reload()
  }

  return (
    <Button className="px-3 shadow-none" onClick={handleUnlink}>
      Отвязать аккаунт
    </Button>
  )
}
