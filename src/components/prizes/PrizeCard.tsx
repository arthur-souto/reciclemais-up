import { useState } from 'react'
import { Coins, Gift, Hourglass } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatShortDate } from '@/lib/date'
import type { Prize } from '@/types/prize'

interface PrizeCardProps {
  prize: Prize
  currentScore: number | undefined
  onRedeem: (prize: Prize) => void
  isRedeeming: boolean
}

export function PrizeCard({ prize, currentScore, onRedeem, isRedeeming }: PrizeCardProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const hasValidImage = !!prize.image_url && !imageFailed
  const isExpired = prize.expiration_date != null && new Date(prize.expiration_date) < new Date()
  const hasEnoughPoints = currentScore != null && currentScore >= prize.required_points
  const canRedeem = hasEnoughPoints && !isExpired

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="relative flex aspect-square items-center justify-center bg-muted">
        {hasValidImage ? (
          <img
            src={prize.image_url ?? undefined}
            alt={prize.name}
            className="size-full object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <Gift className="size-12 text-muted-foreground/40" />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <p className="truncate text-sm font-medium text-foreground" title={prize.name}>
          {prize.name}
        </p>

        <p className="line-clamp-2 text-xs text-muted-foreground">{prize.description}</p>

        <div className="flex flex-wrap items-center gap-1">
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {prize.category ?? 'Sem categoria'}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs font-semibold text-foreground">
          <Coins className="size-3.5 shrink-0 text-amber-500" />
          {prize.required_points} pts
        </div>

        {prize.expiration_date && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Hourglass className="size-3.5 shrink-0" />
            {isExpired ? 'Expirado em' : 'Válido até'} {formatShortDate(prize.expiration_date)}
          </div>
        )}

        <Button
          size="sm"
          className="mt-1"
          disabled={!canRedeem}
          loading={isRedeeming}
          onClick={() => onRedeem(prize)}
        >
          <Gift />
          Resgatar
        </Button>
      </div>
    </div>
  )
}
