"use client"

import React, { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { addDays, format } from "date-fns"
import { ru } from "date-fns/locale"
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"
import { DateRange } from "react-day-picker"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

import { Notifications } from "./Notifications"

const profileFormSchema = z.object({
  room: z
    .string({
      required_error: "Введите название аудитории.",
    })
    .min(2, {
      message: "Название аудитории должно содержать минимум 2 символа.",
    })
    .max(30, {
      message: "Слишком длинное названиее аудитории.",
    }),
  discipline: z
    .string({
      required_error: "Выберите предмет пересдачи.",
    })
    .min(1),
  description: z.string().optional(),
  teachers: z
    .array(
      z.object({
        value: z.string().min(3, { message: "Введите имя преподавателя." }),
      })
    )
    .min(1, {
      message: "Введите хотя бы одного преподавателя.",
    }),
  datetime: z.date(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

function DatePickerWithRange({
  selected,
  setSelected,
  className,
}: {
  selected?: any
  setSelected: any
  className?: string
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !selected && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selected ? (
              <>{format(selected, "LLL dd, y", { locale: ru })} </>
            ) : (
              <span>Выберите дату</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            initialFocus
            selected={selected}
            onSelect={setSelected}
            disabled={(date) => date < new Date()}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

const defaultValues = {}

interface CreationFormProps {
  disciplines: string[]
}

export function CreationForm(props: CreationFormProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  })

  const { fields, append } = useFieldArray({
    name: "teachers",
    control: form.control,
  })

  function onSubmit(data: ProfileFormValues) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  const [filteredDisciplines, setFilteredDisciplines] = useState(
    props.disciplines.slice(0, 100)
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="room"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Аудитория</FormLabel>
              <FormControl>
                <Input placeholder="А-123 (В-78)" {...field} />
              </FormControl>
              <FormDescription>
                Номер аудитории и кампус (если это важно).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="discipline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Предмет</FormLabel>
              <Popover>
                <FormControl>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {props.disciplines.find(
                        (discipline) => discipline === field.value
                      ) ?? "Выберите предмет"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                </FormControl>
                <PopoverContent className="w-full p-0">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Поиск предмета..."
                      onValueChange={(value) => {
                        const newDisciplines = props.disciplines
                          .filter((discipline) => {
                            const words = value.split(" ")
                            return words.every((word) => {
                              const regex = new RegExp(word, "gi")
                              return regex.test(discipline)
                            })
                          })
                          .slice(0, 100)

                        setFilteredDisciplines(newDisciplines)
                      }}
                    />
                    <CommandEmpty>Предмет не найден.</CommandEmpty>
                    <CommandGroup>
                      <ScrollArea className="h-[320px]">
                        {filteredDisciplines.map((discipline) => (
                          <CommandItem
                            key={discipline}
                            onSelect={() => {
                              form.setValue("discipline", discipline)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === discipline
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {discipline}
                          </CommandItem>
                        ))}
                      </ScrollArea>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Для предмета можно назначить только одну пересдачу.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Расскажите о требованиях для присутствия на пересдаче или любые другие комментарии для студентов"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Вы можете загрузить файл на{" "}
                <Link href="https://cloud.mirea.ru/" className="underline">
                  https://cloud.mirea.ru/
                </Link>{" "}
                и вставить ссылку
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Notifications />
        <div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`teachers.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && "sr-only")}>
                    Преподаватели
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && "sr-only")}>
                    Укажите ФИО всех принимающих преподавателей.
                  </FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ value: "" })}
          >
            Добавить
          </Button>
          <FormMessage />
        </div>
        <FormField
          control={form.control}
          name="datetime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Выберите дату</FormLabel>
              <FormControl>
                <DatePickerWithRange
                  className="[&>button]:w-[260px]"
                  setSelected={field.onChange}
                  selected={field.value}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit">Создать</Button>
      </form>
    </Form>
  )
}
