import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Gift, Plus } from 'lucide-react'
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
import { PrizeForm } from '@/components/admin/PrizeForm'
import { PrizeAdminCard } from '@/components/admin/PrizeAdminCard'
import { PrizeRedemptionsDialog } from '@/components/admin/PrizeRedemptionsDialog'
import { getApiErrorMessage } from '@/api/axios'
import { useDeletePrize, usePrizes } from '@/hooks/usePrizes'
import type { Prize } from '@/types/prize'

const PAGE_SIZE = 10

export function PrizesSection() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, refetch } = usePrizes({ page, limit: PAGE_SIZE })
  const prizes = data?.payload
  const meta = data?.meta
  const deletePrize = useDeletePrize()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPrize, setEditingPrize] = useState<Prize | null>(null)
  const [redemptionsTarget, setRedemptionsTarget] = useState<Prize | null>(null)

  useEffect(() => {
    if (meta && meta.totalPages > 0 && page > meta.totalPages) {
      setPage(meta.totalPages)
    }
  }, [meta, page])

  function openCreateForm() {
    setEditingPrize(null)
    setIsFormOpen(true)
  }

  function openEditForm(prize: Prize) {
    setEditingPrize(prize)
    setIsFormOpen(true)
  }

  function handleDelete(prize: Prize) {
    if (prize.id == null) return
    const confirmed = window.confirm(`Excluir o prêmio "${prize.name}"? Esta ação não pode ser desfeita.`)
    if (!confirmed) return

    deletePrize.mutate(prize.id, {
      onSuccess: () => toast.success('Prêmio removido com sucesso.'),
      onError: (error) => toast.error(getApiErrorMessage(error, 'Não foi possível remover o prêmio.')),
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Prêmios</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie os prêmios disponíveis para resgate na plataforma.
          </p>
        </div>
        <Button size="sm" onClick={openCreateForm} className="w-full sm:w-auto">
          <Plus />
          Novo prêmio
        </Button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <Skeleton key={index} className="aspect-square w-full" />
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <ErrorState mensagem="Não foi possível carregar os prêmios." onRetry={() => refetch()} />
      )}

      {!isLoading && !isError && prizes?.length === 0 && (
        <EmptyState mensagem="Nenhum prêmio cadastrado ainda." icon={Gift} />
      )}

      {!isLoading && !isError && prizes != null && prizes.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {prizes.map((prize) => (
            <PrizeAdminCard
              key={prize.id}
              prize={prize}
              onEdit={openEditForm}
              onDelete={handleDelete}
              onViewRedemptions={setRedemptionsTarget}
            />
          ))}
        </div>
      )}

      {!isLoading && !isError && meta != null && meta.total > 0 && (
        <Pagination meta={meta} onPageChange={setPage} disabled={isLoading} />
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingPrize ? 'Editar prêmio' : 'Novo prêmio'}</DialogTitle>
            <DialogDescription>
              {editingPrize
                ? 'Atualize as informações do prêmio selecionado.'
                : 'Preencha os dados para cadastrar um novo prêmio.'}
            </DialogDescription>
          </DialogHeader>
          <PrizeForm prize={editingPrize} onSaved={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>

      <PrizeRedemptionsDialog
        prize={redemptionsTarget}
        onOpenChange={(open) => !open && setRedemptionsTarget(null)}
      />
    </div>
  )
}
