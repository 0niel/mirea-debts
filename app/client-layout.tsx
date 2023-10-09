"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { HeaderNavbar } from "@/components/HeaderNavbar"
import { ThemeProvider } from "@/components/theme-provider"

import "./globals.css"
import SupabaseProvider from "@/lib/supabase/supabase-provider"
import { Toaster } from "@/components/ui/toaster"
import { ThemeCommandMenu } from "@/components/ThemeCommandMenu"
import { UserNav } from "@/components/UserNav"

const queryClient = new QueryClient()

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SupabaseProvider>
      <QueryClientProvider client={queryClient}>
        <html lang="ru">
          <body>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="flex-col md:flex">
                <div className="border-b">
                  <div className="flex h-16 items-center justify-between px-4">
                    <HeaderNavbar className="mx-6" />
                    <div className="flex items-center space-x-4">
                      <ThemeCommandMenu />
                      <UserNav />
                    </div>
                  </div>
                </div>
                <main className="flex-1 space-y-4 p-8 pt-6">{children}</main>
              </div>
            </ThemeProvider>
            <Toaster />
            <footer>
              <p className="mb-4 text-center text-xs text-muted-foreground">
                Powered by Mirea Ninja
              </p>
            </footer>
          </body>
        </html>
      </QueryClientProvider>
    </SupabaseProvider>
  )
}