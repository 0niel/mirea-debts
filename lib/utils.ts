import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const roleMapper = new Map<string, string>([
  ["admin", "Админ"],
  ["editor", "Редактор"],
])
