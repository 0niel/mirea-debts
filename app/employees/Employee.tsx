import { ChevronDownIcon } from "@radix-ui/react-icons"

import { Database } from "@/lib/supabase/db-types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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

type Employee = Database["rtu_mirea"]["Tables"]["employees"]["Row"]
type Profile = Database["rtu_mirea"]["Tables"]["profiles"]["Row"]

export interface EmployeeProps {
  employee: Employee & {
    profile?: Profile
  }
}

const getName = (employee: Employee & { profile?: Profile }) => {
  if (employee.profile) {
    return `${employee.profile?.first_name} ${employee.profile?.last_name}`
  }

  return "Неизвестный"
}

export function Employee({ employee }: EmployeeProps) {
  return (
    <div className="flex items-center justify-between space-x-4">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarFallback>
            {employee.profile?.first_name[0]} {employee.profile?.last_name[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium leading-none">
            {getName(employee)}
            <span className="ml-2 text-sm text-muted-foreground">
              {employee.profile?.email}
            </span>
          </p>

          <p className="text-sm text-muted-foreground">{employee.post}</p>
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
  )
}
