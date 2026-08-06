import { useState } from 'react'
import { toast } from 'sonner'
import { Gift, History, Wallet } from 'lucide-react'
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
import { PrizeCard } from '@/components/prizes/PrizeCard'
import { RedemptionPrizeInfo } from '@/components/prizes/RedemptionPrizeInfo'
import { getApiErrorMessage } from '@/api/axios'
import { usePrizes } from '@/hooks/usePrizes'
import { useMyRedemptions, useRedeemPrize } from '@/hooks/usePrizeRedemptions'
import { useUser } from '@/hooks/useUsers'
import { useAuthContext } from '@/context/AuthContext'
import { formatDateTime } from '@/lib/date'
import type { Prize } from '@/types/prize'

const CATALOG_PAGE_SIZE = 50
const REDEMPTIONS_PAGE_SIZE = 10

function RedemptionsHistoryDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, refetch } = useMyRedemptions({ page, limit: REDEMPTIONS_PAGE_SIZE })
  const redemptions = data?.payload
  const meta = data?.meta

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Meus resgates</DialogTitle>
          <DialogDescription>Histórico de prêmios que você já resgatou.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {isLoading && (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full" />
              ))}
            </div>
          )}

          {!isLoading && isError && (
            <ErrorState mensagem="Não foi possível carregar seus resgates." onRetry={() => refetch()} />
          )}

          {!isLoading && !isError && redemptions?.length === 0 && (
            <EmptyState mensagem="Você ainda não resgatou nenhum prêmio." icon={History} />
          )}

          {!isLoading && !isError && redemptions != null && redemptions.length > 0 && (
            <ul className="flex flex-col divide-y divide-border rounded-lg border border-border text-sm">
              {redemptions.map((redemption) => (
                <li key={redemption.id} className="flex items-center justify-between px-3 py-2">
                  <RedemptionPrizeInfo prizeId={redemption.fk_prize} />
                  <span className="text-xs text-muted-foreground">
                    {formatDateTime(redemption.redeemed_at)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {!isLoading && !isError && meta != null && meta.total > 0 && (
            <Pagination meta={meta} onPageChange={setPage} disabled={isLoading} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function PrizeCatalog() {
  const { user: sessionUser } = useAuthContext()
  const { data: liveUser } = useUser(sessionUser?.id ?? '')
  const user = liveUser ?? sessionUser
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  const {
    data: prizesData,
    isLoading: isLoadingPrizes,
    isError: isPrizesError,
    refetch: refetchPrizes,
  } = usePrizes({ page: 1, limit: CATALOG_PAGE_SIZE })
  const activePrizes = prizesData?.payload.filter((prize) => prize.status === 'ACTIVE')

  const redeemPrize = useRedeemPrize()

  function handleRedeem(prize: Prize) {
    if (prize.id == null) return
    const confirmed = window.confirm(`Resgatar "${prize.name}" por ${prize.required_points} pontos?`)
    if (!confirmed) return

    redeemPrize.mutate(prize.id, {
      onSuccess: () => toast.success('Prêmio resgatado com sucesso!'),
      onError: (error) => toast.error(getApiErrorMessage(error, 'Não foi possível resgatar o prêmio.')),
    })
  }

  return (
    <div className="flex w-full flex-col gap-8 px-6 pt-8 pb-16 sm:px-8 lg:px-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex w-fit items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
          <Wallet className="size-5 text-amber-500" />
          <span className="text-sm text-muted-foreground">Seu saldo:</span>
          <span className="text-lg font-semibold text-foreground">{user?.total_score ?? '—'} pts</span>
        </div>

        <Button variant="outline" size="sm" onClick={() => setIsHistoryOpen(true)}>
          <History />
          Meus resgates
        </Button>
      </div>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Prêmios disponíveis</h2>
          <p className="text-sm text-muted-foreground">Troque seus pontos por prêmios.</p>
        </div>

        {isLoadingPrizes && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="aspect-square w-full" />
            ))}
          </div>
        )}

        {!isLoadingPrizes && isPrizesError && (
          <ErrorState mensagem="Não foi possível carregar os prêmios." onRetry={() => refetchPrizes()} />
        )}

        {!isLoadingPrizes && !isPrizesError && activePrizes?.length === 0 && (
          <EmptyState mensagem="Nenhum prêmio disponível no momento." icon={Gift} />
        )}

        {!isLoadingPrizes && !isPrizesError && activePrizes != null && activePrizes.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {activePrizes.map((prize) => (
              <PrizeCard
                key={prize.id}
                prize={prize}
                currentScore={user?.total_score}
                onRedeem={handleRedeem}
                isRedeeming={redeemPrize.isPending}
              />
            ))}
          </div>
        )}
      </section>

      <RedemptionsHistoryDialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen} />
    </div>
  )
}
