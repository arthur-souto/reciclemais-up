import { useState } from 'react'
import { Coins, Gift, Pencil, Trash2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { PrizeStatusBadge } from '@/components/admin/PrizeStatusBadge'
import { PrizeTypeBadge } from '@/components/prizes/PrizeTypeBadge'
import { useUser } from '@/hooks/useUsers'
import type { Prize } from '@/types/prize'

function PrizeCreator({ userId }: { userId: string | null }) {
  const { data: user, isLoading } = useUser(userId ?? '')

  if (!userId) {
    return <span className="text-muted-foreground">—</span>
  }

  if (isLoading) {
    return <Skeleton className="h-4 w-24" />
  }

  return <span>{user?.name ?? '—'}</span>
}

interface PrizeAdminCardProps {
  prize: Prize
  onEdit: (prize: Prize) => void
  onDelete: (prize: Prize) => void
  onViewRedemptions: (prize: Prize) => void
}

export function PrizeAdminCard({ prize, onEdit, onDelete, onViewRedemptions }: PrizeAdminCardProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const hasValidImage = !!prize.image_url && !imageFailed

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
        <PrizeStatusBadge status={prize.status} className="absolute top-2 right-2" />
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <p className="truncate text-sm font-medium text-foreground" title={prize.name}>
          {prize.name}
        </p>

        <div className="flex flex-wrap items-center gap-1">
          <PrizeTypeBadge type={prize.type} />
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {prize.category ?? 'Sem categoria'}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs font-semibold text-foreground">
          <Coins className="size-3.5 shrink-0 text-amber-500" />
          {prize.required_points} pts
        </div>

        {prize.type === 'PHYSICAL' && (
          <div className="text-xs text-muted-foreground">
            {prize.quantity == null
              ? 'Estoque ilimitado'
              : prize.quantity === 0
                ? <span className="font-medium text-destructive">Esgotado</span>
                : `${prize.quantity} em estoque`}
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          Criado por <PrizeCreator userId={prize.fk_created_by} />
        </div>

        <div className="mt-1 flex justify-end gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => onViewRedemptions(prize)}>
            <Users />
            <span className="sr-only">Ver resgates</span>
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => onEdit(prize)}>
            <Pencil />
            <span className="sr-only">Editar</span>
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => onDelete(prize)}>
            <Trash2 />
            <span className="sr-only">Excluir</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
