"use client"

import * as React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProviderProps } from "next-themes/dist/types"

import SupabaseProvider from "@/lib/supabase/supabase-provider"
import { TooltipProvider } from "@/components/ui/tooltip"

import { ThemeProvider } from "./theme-provider"
import { Toaster } from "./ui/toaster"

const queryClient = new QueryClient()

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <SupabaseProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </SupabaseProvider>
  )
}
