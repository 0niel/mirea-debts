import { Metadata } from "next"

import "./globals.css"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { Providers } from "@/components/Providers"

export const metadata: Metadata = {
  title: "Пересдачи РТУ МИРЭА",
  description: "Расписание пересдач и информация о задолженностях",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">
              <div className="flex-col md:flex">
                <Header />
                <main className="flex-1 space-y-4 p-4 pt-6 md:p-8">
                  {children}
                </main>
              </div>
            </div>

            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
