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
    <section className="px-4 pt-6 pb-12 sm:px-8 sm:pt-8 sm:pb-16 lg:px-12">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-border bg-card shadow-sm">

        {/* Cabeçalho em destaque */}
        <div className="flex flex-col gap-4 border-b border-border/60 bg-gradient-to-br from-hero/60 via-card to-card px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-7">
          <div className="flex items-center gap-3.5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:size-14">
              <Recycle className="size-6 sm:size-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">Suas últimas entregas</h2>
                {meta != null && meta.total > 0 && (
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {meta.total} {meta.total === 1 ? 'registrada' : 'registradas'}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                Acompanhe suas entregas de materiais recicláveis e envie evidências para ganhar pontos.
              </p>
            </div>
          </div>
          <Button size="lg" onClick={() => setIsCreateOpen(true)} className="w-full shrink-0 sm:w-auto">
            <Plus />
            Nova entrega
          </Button>
        </div>

        <div className="flex flex-col gap-5 px-5 py-6 sm:px-8 sm:py-7">
          {isLoading && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        </div>
      </div>

      <Button
        size="icon-lg"
        onClick={() => setIsCreateOpen(true)}
        className="fixed bottom-6 right-6 z-20 rounded-full shadow-lg sm:hidden"
        aria-label="Nova entrega"
      >
        <Plus />
      </Button>

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
