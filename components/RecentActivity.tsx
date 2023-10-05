"use client"

import { ScrollArea } from "@radix-ui/react-scroll-area"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentActivity() {
  return (
    <div className="space-y-8">
      <div className="flex items-start">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback>СД</AvatarFallback>
        </Avatar>

        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Сергей Дмитриев</p>
          <p className="text-sm text-muted-foreground">dmitriev@mirea.ru</p>
        </div>
        <div className="ml-auto font-medium leading-none sm:ml-6">
          создал(а) пересдачу «Иностранный язык (Зачет, 2/4, № 78110)»
        </div>
      </div>
    </div>
  )
}
