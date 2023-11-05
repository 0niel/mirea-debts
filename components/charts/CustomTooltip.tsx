export function CustomTooltip({
  payload,
  label,
  active,
  payloadSuffix = "",
}: any) {
  if (active) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="flex flex-col">
          <span className="font-bold text-muted-foreground">
            {payload[0]?.value} {payloadSuffix ?? ""}
          </span>
        </div>
      </div>
    )
  }

  return null
}
