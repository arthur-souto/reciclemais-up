import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DeliveryStatusBadge } from '@/components/deliveries/DeliveryStatusBadge'
import { ImportanceBadge } from '@/components/ImportanceBadge'
import { useUser } from '@/hooks/useUsers'
import { formatDateTime } from '@/lib/date'
import type { Delivery } from '@/types/delivery'

function ApprovedBy({ userId }: { userId: string | null }) {
  const { data: user, isLoading } = useUser(userId ?? '')

  if (!userId) return <span className="text-muted-foreground">—</span>
  if (isLoading) return <span className="text-muted-foreground">Carregando...</span>
  return <span>{user?.name ?? '—'}</span>
}

interface DeliveryDetailsDialogProps {
  delivery: Delivery | null
  onOpenChange: (open: boolean) => void
}

export function DeliveryDetailsDialog({ delivery, onOpenChange }: DeliveryDetailsDialogProps) {
  return (
    <Dialog open={delivery != null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {delivery && (
          <>
            <DialogHeader>
              <DialogTitle>{delivery.material?.name ?? delivery.material_type}</DialogTitle>
              <DialogDescription>Detalhes da entrega #{delivery.id}</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 text-sm">
              <div className="flex items-center gap-2">
                <DeliveryStatusBadge status={delivery.status} />
                {delivery.material && <ImportanceBadge importance={delivery.material.importance} />}
              </div>

              <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <dt className="text-xs text-muted-foreground">Local</dt>
                  <dd className="text-foreground">{delivery.local}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Quantidade</dt>
                  <dd className="text-foreground">{delivery.quantity} un.</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Peso</dt>
                  <dd className="text-foreground">{delivery.weight} kg</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Pontuação</dt>
                  <dd className="text-foreground">{delivery.total_score} pts</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Coordenadas</dt>
                  <dd className="text-foreground">
                    {delivery.latitude}, {delivery.longitude}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Recolhido em</dt>
                  <dd className="text-foreground">{formatDateTime(delivery.collected_at)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Registrado em</dt>
                  <dd className="text-foreground">{formatDateTime(delivery.created_at)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Atualizado em</dt>
                  <dd className="text-foreground">{formatDateTime(delivery.updated_at)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Aprovado por</dt>
                  <dd className="text-foreground">
                    <ApprovedBy userId={delivery.fk_approved_by} />
                  </dd>
                </div>
              </dl>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
