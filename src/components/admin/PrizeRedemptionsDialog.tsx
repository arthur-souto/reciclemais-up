import { useEffect, useState } from 'react'
import { Gift } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { Pagination } from '@/components/Pagination'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { usePrizeRedemptions } from '@/hooks/usePrizeRedemptions'
import { useUser } from '@/hooks/useUsers'
import { formatDateTime } from '@/lib/date'
import type { Prize } from '@/types/prize'

const PAGE_SIZE = 10

function RedeemerName({ userId }: { userId: string }) {
  const { data: user, isLoading } = useUser(userId)

  if (isLoading) return <Skeleton className="h-4 w-24" />
  return <span>{user?.name ?? '—'}</span>
}

interface PrizeRedemptionsDialogProps {
  prize: Prize | null
  onOpenChange: (open: boolean) => void
}

export function PrizeRedemptionsDialog({ prize, onOpenChange }: PrizeRedemptionsDialogProps) {
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [prize?.id])

  const { data, isLoading, isError, refetch } = usePrizeRedemptions(prize?.id ?? 0, {
    page,
    limit: PAGE_SIZE,
  })
  const redemptions = data?.payload
  const meta = data?.meta

  return (
    <Dialog open={prize != null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {prize && (
          <>
            <DialogHeader>
              <DialogTitle>Resgates de "{prize.name}"</DialogTitle>
              <DialogDescription>Usuários que já resgataram este prêmio.</DialogDescription>
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
                <ErrorState mensagem="Não foi possível carregar os resgates." onRetry={() => refetch()} />
              )}

              {!isLoading && !isError && redemptions?.length === 0 && (
                <EmptyState mensagem="Ninguém resgatou este prêmio ainda." icon={Gift} />
              )}

              {!isLoading && !isError && redemptions != null && redemptions.length > 0 && (
                <ul className="flex flex-col divide-y divide-border rounded-lg border border-border text-sm">
                  {redemptions.map((redemption) => (
                    <li key={redemption.id} className="flex items-center justify-between px-3 py-2">
                      <RedeemerName userId={redemption.fk_user} />
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
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
