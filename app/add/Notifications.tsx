import { MobileIcon } from "@radix-ui/react-icons"
import { EyeOffIcon, Mail } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function Notifications() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Уведомления</CardTitle>
        <CardDescription>
          Выберите способ уведомления студентов о новой пересдачи.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-1">
        <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
          <Mail className="mt-px h-5 w-5" />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">По почте</p>
            <p className="text-sm text-muted-foreground">
              Мы отправил рассылку всем студентам на почту, если у них есть долг
              по выбранному предмету.
            </p>
          </div>
        </div>
        <div className="-mx-2 flex items-start space-x-4 rounded-md bg-accent p-2 text-accent-foreground transition-all">
          <MobileIcon className="mt-px h-5 w-5" />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              В мобильном приложении
            </p>
            <p className="text-sm text-muted-foreground">
              Студентам придёт пуш-уведомление в мобильном приложении Ninja
              Mirea.
            </p>
          </div>
        </div>
        <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
          <EyeOffIcon className="mt-px h-5 w-5" />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Игнорирование</p>
            <p className="text-sm text-muted-foreground">
              Студентам не придёт никаких уведомлений о новой пересдаче (не
              рекомендуется).
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
