import Link from "next/link"
import {
  ChevronDownIcon,
  CircleIcon,
  Link2Icon,
  PlusIcon,
} from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

export function OnlineEduDisciplinesCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Открыть курс в СДО</CardTitle>
        <CardDescription>
          Ты можешь открыть курс в СДО, если у тебе есть долг по этому предмету,
          даже если ты уже прошел его в прошлом семестре. Используй пароль
          «должник» для доступа к курсу.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link href="https://online-edu.mirea.ru/group-page/" target="_blank">
          <Button variant="secondary" className="px-3 shadow-none">
            <Link2Icon className="mr-2 h-4 w-4" />
            Посмотреть список курсов
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
