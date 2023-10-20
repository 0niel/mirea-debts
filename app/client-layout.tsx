"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { HeaderNavbar } from "@/components/HeaderNavbar"
import { ThemeProvider } from "@/components/theme-provider"

import "./globals.css"
import Image from "next/image"
import Link from "next/link"

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
            <div className="relative flex min-h-screen flex-col">
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <div className="flex-1">
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
                    <main className="flex-1 space-y-4 p-8 pt-6">
                      {children}
                    </main>
                  </div>
                </div>
              </ThemeProvider>
              <Toaster />
              <footer className="py-6 md:px-8 md:py-0">
                <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                  <div className="flex flex-row space-x-4 text-center text-sm leading-loose text-muted-foreground md:text-left">
                    <p className="flex">
                      <Image
                        src="/gerb-modified.png"
                        width={26}
                        height={26}
                        alt="logo"
                        className="mr-2"
                      />

                      <Link
                        href="mailto:lk@mirea.ru"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium underline underline-offset-4"
                      >
                        Техническая поддержка
                      </Link>
                    </p>
                    <p className="flex">
                      <Image
                        src="/mirea-ninja-gray.png"
                        width={26}
                        height={26}
                        alt="logo"
                        className="mr-2"
                      />
                      Built by Mirea Ninja
                    </p>
                  </div>
                </div>
              </footer>
            </div>
          </body>
        </html>
      </QueryClientProvider>
    </SupabaseProvider>
  )
}
