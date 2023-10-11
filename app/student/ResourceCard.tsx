import Image from "next/image"
import Link from "next/link"

export function ResourceCard({
  title,
  description,
  image,
  href,
}: {
  title: string
  description: string
  image: string
  href: string
}) {
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer">
      <div className="flex w-[150px] flex-col items-center space-y-3">
        <div className="overflow-hidden rounded-md">
          <Image
            src={image}
            alt={title}
            width={250}
            height={330}
            className="aspect-[3/4] h-auto w-auto rounded-md border object-cover transition-all hover:scale-105"
          />
        </div>
        <div className="space-y-1 text-sm">
          <h3 className="font-medium leading-none">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </Link>
  )
}
