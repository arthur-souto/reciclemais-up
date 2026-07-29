import { useEffect, useState } from 'react'
import { Plus, Recycle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { Pagination } from '@/components/Pagination'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DeliveryCard } from '@/components/deliveries/DeliveryCard'
import { CreateDeliveryForm } from '@/components/deliveries/CreateDeliveryForm'
import { EvidenceUploadSheet } from '@/components/deliveries/EvidenceUploadSheet'
import { DeliveryDetailsDialog } from '@/components/deliveries/DeliveryDetailsDialog'
import { useDeliveries } from '@/hooks/useDeliveries'
import type { Delivery } from '@/types/delivery'

const PAGE_SIZE = 8

export function DeliveriesSection() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, refetch } = useDeliveries({ page, limit: PAGE_SIZE })
  const deliveries = data?.payload
  const meta = data?.meta

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [evidenceTarget, setEvidenceTarget] = useState<Delivery | null>(null)
  const [detailsTarget, setDetailsTarget] = useState<Delivery | null>(null)

  useEffect(() => {
    if (meta && meta.totalPages > 0 && page > meta.totalPages) {
      setPage(meta.totalPages)
    }
  }, [meta, page])

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Entregas</h2>
          <p className="text-sm text-muted-foreground">
            Registre entregas de materiais recicláveis e envie evidências para ganhar pontos.
          </p>
        </div>
        <Button size="sm" onClick={() => setIsCreateOpen(true)}>
          <Plus />
          Nova entrega
        </Button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <Skeleton key={index} className="aspect-square w-full" />
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <ErrorState mensagem="Não foi possível carregar suas entregas." onRetry={() => refetch()} />
      )}

      {!isLoading && !isError && deliveries?.length === 0 && (
        <EmptyState
          mensagem="Nenhuma entrega registrada ainda. Que tal começar agora?"
          icon={Recycle}
        />
      )}

      {!isLoading && !isError && deliveries != null && deliveries.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {deliveries.map((delivery) => (
            <DeliveryCard
              key={delivery.id}
              delivery={delivery}
              onUploadEvidence={setEvidenceTarget}
              onOpenDetails={setDetailsTarget}
            />
          ))}
        </div>
      )}

      {!isLoading && !isError && meta != null && meta.total > 0 && (
        <Pagination meta={meta} onPageChange={setPage} disabled={isLoading} />
      )}

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nova entrega</DialogTitle>
            <DialogDescription>Registre uma nova entrega de material reciclável.</DialogDescription>
          </DialogHeader>
          <CreateDeliveryForm onSaved={() => setIsCreateOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={evidenceTarget != null} onOpenChange={(open) => !open && setEvidenceTarget(null)}>
        <DialogContent className="sm:max-w-md">
          {evidenceTarget && (
            <>
              <DialogHeader>
                <DialogTitle>Enviar evidência</DialogTitle>
                <DialogDescription>
                  Anexe uma foto que comprove a entrega de{' '}
                  {evidenceTarget.material?.name ?? evidenceTarget.material_type}.
                </DialogDescription>
              </DialogHeader>
              <EvidenceUploadSheet
                delivery={evidenceTarget}
                onClose={() => setEvidenceTarget(null)}
              />
            </>
          )}
        </DialogContent>
      </Dialog>

      <DeliveryDetailsDialog
        delivery={detailsTarget}
        onOpenChange={(open) => !open && setDetailsTarget(null)}
      />
    </section>
  )
}
