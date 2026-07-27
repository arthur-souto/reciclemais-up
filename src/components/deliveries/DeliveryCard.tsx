import { useState } from 'react'
import { Camera, Coins, MapPin, Recycle, Weight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DeliveryStatusBadge } from '@/components/deliveries/DeliveryStatusBadge'
import { ImportanceBadge } from '@/components/ImportanceBadge'
import type { Delivery } from '@/types/delivery'

interface DeliveryCardProps {
  delivery: Delivery
  onUploadEvidence: (delivery: Delivery) => void
}

export function DeliveryCard({ delivery, onUploadEvidence }: DeliveryCardProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const hasValidImage = !!delivery.evidence_url && !imageFailed
  const materialName = delivery.material?.name ?? delivery.material_type

  return (
    <div className="flex aspect-square flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="relative flex flex-1 items-center justify-center bg-muted">
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

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" />
          <span className="truncate" title={delivery.local}>
            {delivery.local}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Weight className="size-3.5 shrink-0" />
          <span>{delivery.quantity} un.</span>
        </div>

        {delivery.status === 'PENDING' && (
          <Button size="sm" className="mt-1" onClick={() => onUploadEvidence(delivery)}>
            <Camera />
            Enviar evidência
          </Button>
        )}
      </div>
    </div>
  )
}
