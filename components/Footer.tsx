"use client"

import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="px-3 py-6 md:px-8 md:py-0">
      <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-row space-x-4 text-center text-sm text-muted-foreground sm:leading-loose md:text-left">
          <p className="flex">
            <Image
              src="/gerb-modified.png"
              width={26}
              height={26}
              alt="logo"
              className="mr-2 h-7 w-7"
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
              className="mr-2 h-7 w-7"
            />
            Built by Mirea Ninja
          </p>
        </div>
      </div>
    </footer>
  )
}
