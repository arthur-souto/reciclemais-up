import { useState } from 'react'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { ArrowRight, Coins, Gift, History, Sparkles, Wallet } from 'lucide-react'
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
  const featuredPrize =
    activePrizes?.find((prize) => !!prize.image_url) ?? activePrizes?.[0]

  const redeemPrize = useRedeemPrize()

  function scrollToCatalog() {
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

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
 
 <div className="flex w-full flex-col gap-8 px-4 pt-5 pb-12 sm:gap-10 sm:px-8 sm:pt-7 sm:pb-16 lg:px-12">
 <section className="flex items-center justify-between gap-3">
  {/* Saldo */}
  <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-sm sm:px-5 sm:py-3.5">
    <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
      <Wallet className="size-5 text-primary" />
    </div>

    <div className="flex flex-col">
      <span className="text-xs font-medium text-muted-foreground">
        Seus pontos
      </span>

      <span className="text-xl font-bold leading-tight text-foreground">
        {user?.total_score ?? '—'}
        <span className="ml-1 text-sm font-medium text-muted-foreground">
          pts
        </span>
      </span>
    </div>
  </div>

  {/* Histórico */}
  <Button
    variant="outline"
    size="lg"
    onClick={() => setIsHistoryOpen(true)}
    className="rounded-2xl border-border/70 bg-card shadow-sm"
  >
    <History className="size-4" />
    <span className="hidden sm:inline">Meus resgates</span>
    <span className="sm:hidden">Resgates</span>
  </Button>
</section>

  {/* Banner de destaque */}
  {!isLoadingPrizes && !isPrizesError && featuredPrize && (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-[#4C7A32] p-6 text-primary-foreground shadow-lg sm:p-10">
      <div className="pointer-events-none absolute -right-14 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

      <div className="relative flex flex-col-reverse items-center gap-6 sm:flex-row sm:justify-between sm:gap-10">
        <div className="max-w-md text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide backdrop-blur">
            <Sparkles className="size-3.5" />
            Destaque da loja
          </span>

          <h2 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
            {featuredPrize.name}
          </h2>

          {featuredPrize.description && (
            <p className="mt-2 line-clamp-2 text-sm text-primary-foreground/85 sm:text-base">
              {featuredPrize.description}
            </p>
          )}

          <div className="mt-4 flex items-center justify-center gap-2 sm:justify-start">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-2 text-sm font-bold backdrop-blur">
              <Coins className="size-4" />
              {featuredPrize.required_points} pts
            </span>
          </div>

          <Button size="lg" variant="secondary" className="mt-6" onClick={scrollToCatalog}>
            Ver todos os prêmios
            <ArrowRight />
          </Button>
        </div>

        <div className="flex size-40 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-white/15 shadow-inner backdrop-blur sm:size-56">
          {featuredPrize.image_url ? (
            <img
              src={featuredPrize.image_url}
              alt={featuredPrize.name}
              className="size-full object-cover"
            />
          ) : (
            <Gift className="size-20 text-white/70" />
          )}
        </div>
      </div>
    </section>
  )}

       {/* Catálogo */}
    <section id="catalogo" className="flex scroll-mt-20 flex-col gap-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Gift className="size-6 text-primary" />

            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Prêmios disponíveis
            </h2>
          </div>

          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
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

  
