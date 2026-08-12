import { useState } from 'react'
import { AxiosError } from 'axios'
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
import type { ApiErrorResponse } from '@/types/api'
import type { Prize } from '@/types/prize'

const CATALOG_PAGE_SIZE = 50
const REDEMPTIONS_PAGE_SIZE = 10

function isRedeemErrorRequiringRefetch(error: unknown) {
  if (!(error instanceof AxiosError) || !error.response) return false
  if (error.response.status === 404) return true
  const message = (error.response.data as ApiErrorResponse | undefined)?.error ?? ''
  return message.includes('esgotado') || message.includes('já resgatado')
}

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
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Não foi possível resgatar o prêmio.'))
        if (isRedeemErrorRequiringRefetch(error)) {
          refetchPrizes()
        }
      },
    })
  }

  return (
 
 <div className="flex w-full flex-col gap-7 px-4 pt-5 pb-12 sm:gap-9 sm:px-8 sm:pt-7 sm:pb-16 lg:px-12">
 <section className="flex items-center justify-between gap-3">
  {/* Saldo */}
  <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card px-3.5 py-2.5 shadow-sm sm:px-4">
    <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
      <Wallet className="size-4 text-primary" />
    </div>

    <div className="flex flex-col">
      <span className="text-[11px] font-medium text-muted-foreground">
        Seus pontos
      </span>

      <span className="text-base font-bold leading-tight text-foreground">
        {user?.total_score ?? '—'}
        <span className="ml-1 text-xs font-medium text-muted-foreground">
          pts
        </span>
      </span>
    </div>
  </div>

  {/* Histórico */}
  <Button
    variant="outline"
    size="sm"
    onClick={() => setIsHistoryOpen(true)}
    className="h-11 rounded-2xl border-border/70 bg-card px-3.5 shadow-sm"
  >
    <History className="size-4" />
    <span className="hidden sm:inline">Meus resgates</span>
    <span className="sm:hidden">Resgates</span>
  </Button>
</section>
       {/* Catálogo */}
    <section className="flex flex-col gap-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Gift className="size-5 text-primary" />

            <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
              Prêmios disponíveis
            </h2>
          </div>

          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Use seus pontos para desbloquear benefícios.
          </p>
        </div>
      </div>

      {isLoadingPrizes && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton
              key={index}
              className="aspect-[0.82] w-full rounded-2xl"
            />
          ))}
        </div>
      )}

      {!isLoadingPrizes && isPrizesError && (
        <ErrorState
          mensagem="Não foi possível carregar os prêmios."
          onRetry={() => refetchPrizes()}
        />
      )}

      {!isLoadingPrizes &&
        !isPrizesError &&
        activePrizes?.length === 0 && (
          <EmptyState
            mensagem="Nenhum prêmio disponível no momento."
            icon={Gift}
          />
        )}

      {!isLoadingPrizes &&
        !isPrizesError &&
        activePrizes != null &&
        activePrizes.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
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

    <RedemptionsHistoryDialog
      open={isHistoryOpen}
      onOpenChange={setIsHistoryOpen}
    />
  </div>
       
    
     
 
  )
}

  
