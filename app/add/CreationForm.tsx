"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"

import { useSupabase } from "@/lib/supabase/supabase-provider"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast, useToast } from "@/components/ui/use-toast"

import { Notifications } from "./Notifications"

const profileFormSchema = z.object({
  place: z
    .string({
      required_error: "Введите название аудитории или ссылку на пересдачу.",
    })
    .min(2, {
      message:
        "Название аудитории или ссылка должно содержать минимум 2 символа.",
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
  date: z.date({
    required_error: "Выберите дату и время.",
  }),
  time_start: z.string({
    required_error: "Выберите дату и время.",
  }),
  time_end: z.string({
    required_error: "Выберите дату и время.",
  }),
  need_statement: z.boolean().default(false),
  is_online: z.boolean().default(false),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

function DatePicker({
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
  const { supabase } = useSupabase()
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  })

  const { fields, append } = useFieldArray({
    name: "teachers",
    control: form.control,
  })

  async function onSubmit(data: ProfileFormValues) {
    const retakes = await supabase
      .schema("rtu_mirea")
      .from("retakes")
      .select("*")
      .eq("discipline", data.discipline)

    if (
      retakes?.data?.length !== 0 &&
      retakes?.data?.some(
        (retake) => retake?.date === data.date.toISOString().split("T")[0]
      )
    ) {
      toast({
        variant: "destructive",
        title: "ОЙ! Что-то пошло не так.",
        description: "Для этого предмета уже назначена пересдача в этот день.",
      })

      return
    }

    try {
      const now = new Date()
      const date = data.date
      date.setHours(parseInt(data.time_start.split(":")[0]))
      if (date.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
        if (
          !confirm(
            "Вы создаёте пересдачу, до которой с момента её создания пройдёт менее 24 часов. Мы рекомендуем создавать пересдачи заранее. Вы уверены, что хотите создать пересдачу?"
          )
        ) {
          return
        }
      } else if (now.getHours() >= 23 || now.getHours() <= 5) {
        if (
          !confirm(
            "Мы отправим уведомление всем студентам, которые имеют задолженность по этому предмету. Вы уверены, что хотите создать пересдачу сейчас? "
          )
        ) {
          return
        }
      }
    } catch (e) {
      console.error(e)
    }

    const teachers = data.teachers
      .map((teacher) => teacher.value.trim().replace(",", " "))
      .filter((teacher) => teacher !== "")
      .join(", ")

    const retake = {
      place: data.place,
      discipline: data.discipline,
      description: data.description,
      teachers,
      date: data.date.toISOString().split("T")[0],
      time_start: data.time_start,
      time_end: data.time_end,
      need_statement: data.need_statement,
      is_online: data.is_online,
    }

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

    router.push("/dashboard")
  }

  const [filteredDisciplines, setFilteredDisciplines] = useState(
    props.disciplines.slice(0, 100)
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="is_online"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Пересдача будет онлайн?</FormLabel>
                <FormDescription>
                  Отметьте, если пересдача будет проводиться онлайн.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="place"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {form.watch("is_online") ? "Ссылка" : "Аудитория"}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    form.watch("is_online") ? "https://..." : "А-123 (В-78)"
                  }
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {form.watch("is_online") ? (
                  <>
                    Вставьте ссылку на пересдачу в Zoom, Webinar или другую
                    платформу (например, курс в СДО).
                  </>
                ) : (
                  <>Номер аудитории и кампус (если это важно).</>
                )}
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

        <FormField
          control={form.control}
          name="need_statement"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Студенту нужна ведомость/допуск?</FormLabel>
                <FormDescription>
                  Отметьте, должен ли студент взять допуск в учебном отделе
                  института, чтобы присутствовать на пересдаче?
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
{/* 
        <Notifications /> */}

        <div>
          <div className={cn(fields.length !== 0 && "sr-only")}>
            <FormLabel>Преподаватели</FormLabel>
            <FormDescription>
              Укажите ФИО всех принимающих преподавателей.
            </FormDescription>
          </div>
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
                    Укажите ФИО всех принимающих преподавателей. Пустые поля
                    будут игнорироваться.
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
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Выберите дату</FormLabel>
              <FormControl>
                <div className="flex flex-row space-x-2">
                  <DatePicker
                    className="[&>button]:w-[260px]"
                    setSelected={field.onChange}
                    selected={field.value}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex flex-row space-x-2">
          <FormField
            control={form.control}
            name="time_start"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Начало</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    id="time"
                    min="09:00"
                    max="20:00"
                    className="w-[100px]"
                    {...field}
                    required
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="time_end"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Конец</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    id="time"
                    min="09:00"
                    max="21:00"
                    className="w-[100px]"
                    {...field}
                    required
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Создать</Button>
      </form>
    </Form>
  )
}
