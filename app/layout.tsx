import { Metadata } from "next"

import ClientLayout from "./client-layout"

export const metadata: Metadata = {
  title: "Пересдачи РТУ МИРЭА",
  description: "Расписание пересдач и информация о задолженностях",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}
