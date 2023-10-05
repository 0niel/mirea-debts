import Link from "next/link"
import { AlertCircle, FileWarning, Terminal } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function YearDebtAlert() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>
        У вас имеются задоленности, не ликвидированные более года!
      </AlertTitle>
      <AlertDescription>
        Согласно{" "}
        <Link
          href={
            "https://www.mirea.ru/upload/iblock/e2a/ubvvwadtkedvhbxxxc8m6weq1p2uqrhu/Polozhenie-o-poryadke-otchisleniya_v_1.5.7.pdf"
          }
          target="_blank"
          className="underline"
        >
          положению о порядке отчисления
        </Link>
        , вы должны ликвидировать академическую задолженность в течение года, но
        не позднее начала второй сессии с момента возникновения задолженности.
        Вы можете быть отчислены. Приступите к ликвидации задоленности как можно
        скорее!
      </AlertDescription>
    </Alert>
  )
}
