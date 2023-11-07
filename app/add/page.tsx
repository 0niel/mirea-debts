import { Suspense } from "react"

import { Skeleton } from "@/components/ui/skeleton"

import ContentWithDisciplines from "./ContentWithDisciplines"

export const dynamic = "force-dynamic"

export default function Add() {
  return (
    <>
      <Suspense
        fallback={
          <div className="flex h-full flex-col space-y-4 overflow-hidden">
            <Skeleton className="h-14 w-72" />

            <div className="space-y-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          </div>
        }
      >
        <ContentWithDisciplines />
      </Suspense>
    </>
  )
}
