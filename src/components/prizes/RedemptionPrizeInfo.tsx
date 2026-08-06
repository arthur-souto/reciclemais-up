import { Skeleton } from '@/components/ui/skeleton'
import { usePrize } from '@/hooks/usePrizes'

export function RedemptionPrizeInfo({ prizeId }: { prizeId: number }) {
  const { data: prize, isLoading } = usePrize(prizeId)

  if (isLoading) return <Skeleton className="h-4 w-32" />
  return <span>{prize?.name ?? `Prêmio #${prizeId}`}</span>
}
