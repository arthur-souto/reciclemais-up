import { useState } from 'react'
import { Coins, Gift, Hourglass } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PrizeTypeBadge } from '@/components/prizes/PrizeTypeBadge'
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
  const isOutOfStock = prize.type === 'PHYSICAL' && prize.quantity === 0
  const canRedeem = hasEnoughPoints && !isExpired && !isOutOfStock

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative flex aspect-square items-center justify-center bg-muted">
        {hasValidImage ? (
          <img
            src={prize.image_url ?? undefined}
            alt={prize.name}
            className="size-full object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <Gift className="size-14 text-muted-foreground/40" />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="truncate text-base font-semibold text-foreground" title={prize.name}>
          {prize.name}
        </p>

        <p className="line-clamp-2 text-sm text-muted-foreground">{prize.description}</p>

        <div className="flex flex-wrap items-center gap-1.5">
          <PrizeTypeBadge type={prize.type} />
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {prize.category ?? 'Sem categoria'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <Coins className="size-4 shrink-0 text-amber-500" />
          {prize.required_points} pts
        </div>

        {prize.type === 'PHYSICAL' && prize.quantity != null && (
          <div className={`text-sm ${isOutOfStock ? 'font-medium text-destructive' : 'text-muted-foreground'}`}>
            {isOutOfStock ? 'Esgotado' : `${prize.quantity} disponíveis`}
          </div>
        )}

        {prize.expiration_date && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Hourglass className="size-4 shrink-0" />
            {isExpired ? 'Expirado em' : 'Válido até'} {formatShortDate(prize.expiration_date)}
          </div>
        )}

        <Button
          size="sm"
          className="mt-1.5"
          disabled={!canRedeem}
          loading={isRedeeming}
          onClick={() => onRedeem(prize)}
        >
          <Gift />
          {isOutOfStock ? 'Esgotado' : 'Resgatar'}
        </Button>
      </div>
    </div>
  )
}
