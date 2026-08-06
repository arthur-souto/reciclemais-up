import { useState } from 'react'
import { CalendarDays, Camera, Coins, MapPin, PackageCheck, Recycle, RefreshCw, Trophy, Weight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DeliveryStatusBadge } from '@/components/deliveries/DeliveryStatusBadge'
import { ImportanceBadge } from '@/components/ImportanceBadge'
import { formatDateTime, formatShortDate } from '@/lib/date'
import type { Delivery } from '@/types/delivery'

interface DeliveryCardProps {
  delivery: Delivery
  onUploadEvidence: (delivery: Delivery) => void
  onOpenDetails: (delivery: Delivery) => void
}

export function DeliveryCard({ delivery, onUploadEvidence, onOpenDetails }: DeliveryCardProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const hasValidImage = !!delivery.evidence_url && !imageFailed
  const materialName = delivery.material?.name ?? delivery.material_type

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpenDetails(delivery)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpenDetails(delivery)
        }
      }}
      className="flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-card text-left shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative flex aspect-square w-full shrink-0 items-center justify-center bg-muted">
        {hasValidImage ? (
          <img
            src={delivery.evidence_url ?? undefined}
            alt={`Evidência da entrega de ${materialName}`}
            className="size-full object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <Recycle className="size-12 text-muted-foreground/40" />
        )}
        <DeliveryStatusBadge status={delivery.status} className="absolute top-2 right-2" />
      </div>

      <div className="flex flex-col gap-1.5 p-3">
        <p className="truncate text-sm font-medium text-foreground" title={materialName}>
          {materialName}
        </p>

        {delivery.material && (
          <div className="flex flex-wrap items-center gap-1">
            <ImportanceBadge importance={delivery.material.importance} />
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              <Coins className="size-3" />
              {delivery.material.points_value} pts/un.
            </span>
          </div>
        )}

        <div className="flex items-center gap-1 text-xs font-semibold text-foreground">
          <Trophy className="size-3.5 shrink-0 text-amber-500" />
          {delivery.total_score} pts
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" />
          <span className="truncate" title={delivery.local}>
            {delivery.local}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Weight className="size-3.5 shrink-0" />
          <span>
            {delivery.quantity} un. · {delivery.weight} kg
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-muted-foreground/80">
          <span
            className="inline-flex items-center gap-0.5"
            title={`Registrada em ${formatDateTime(delivery.created_at)}`}
          >
            <CalendarDays className="size-3 shrink-0" />
            {formatShortDate(delivery.created_at)}
          </span>
          <span
            className="inline-flex items-center gap-0.5"
            title={`Atualizada em ${formatDateTime(delivery.updated_at)}`}
          >
            <RefreshCw className="size-3 shrink-0" />
            {formatShortDate(delivery.updated_at)}
          </span>
          <span
            className="inline-flex items-center gap-0.5"
            title={`Recolhida em ${formatDateTime(delivery.collected_at)}`}
          >
            <PackageCheck className="size-3 shrink-0" />
            {formatShortDate(delivery.collected_at)}
          </span>
        </div>

        {delivery.status === 'PENDING' && (
          <Button
            size="sm"
            className="mt-1"
            onClick={(event) => {
              event.stopPropagation()
              onUploadEvidence(delivery)
            }}
          >
            <Camera />
            Enviar evidência
          </Button>
        )}
      </div>
    </div>
  )
}
