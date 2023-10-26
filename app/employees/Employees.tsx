import { ChevronDownIcon } from "@radix-ui/react-icons"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function EmployeesPermissionsCard({
  department,
}: {
  department: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          {department[0].toUpperCase() + department.slice(1)}
        </CardTitle>
        <CardDescription>
          Вы можете управлять доступом к пересдачам для сотрудников вашей
          кафедры.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="/avatars/01.png" />
              <AvatarFallback>СД</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">
                Сергей Дмитриев
              </p>
              <p className="text-sm text-muted-foreground">dmitriev@mirea.ru</p>
            </div>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Админ{" "}
                <ChevronDownIcon className="ml-2 h-4 w-4 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="end">
              <Command>
                <CommandInput placeholder="Поиск по ролям" />
                <CommandList>
                  <CommandEmpty>Роли не найдены.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                      <p>Просмотр</p>
                      <p className="text-sm text-muted-foreground">
                        Может просматривать пересдачи и статистику по кафедре.
                      </p>
                    </CommandItem>
                    <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                      <p>Редактор</p>
                      <p className="text-sm text-muted-foreground">
                        Может создавать пересдачи.
                      </p>
                    </CommandItem>
                    <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                      <p>Админ</p>
                      <p className="text-sm text-muted-foreground">
                        Может управлять доступом для сотрудников кафедры.
                      </p>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  )
}
