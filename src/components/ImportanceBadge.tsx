import { Importance, type ImportanceValue } from '@/types/material'
import { cn } from '@/lib/utils'

export const IMPORTANCE_TIERS = [
  {
    ...Importance.EXTREMELY_LOW,
    className: 'bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300',
  },
  {
    ...Importance.VERY_LOW,
    className: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400',
  },
  {
    ...Importance.LOW,
    className: 'bg-lime-100 text-lime-700 dark:bg-lime-500/15 dark:text-lime-400',
  },
  {
    ...Importance.MEDIUM,
    className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400',
  },
  {
    ...Importance.LOW_IMPORTANCE,
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  },
  {
    ...Importance.IMPORTANT,
    className: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400',
  },
  {
    ...Importance.VERY_IMPORTANT,
    className: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
  },
] as const

export function getImportanceTier(value: number) {
  return IMPORTANCE_TIERS.find((tier) => tier.value === value)
}

interface ImportanceBadgeProps {
  importance: ImportanceValue | number
  className?: string
}

export function ImportanceBadge({ importance, className }: ImportanceBadgeProps) {
  const tier = getImportanceTier(importance)

  return (
    <span
      className={cn(
        'inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-medium',
        tier?.className ?? 'bg-muted text-muted-foreground',
        className,
      )}
    >
      {tier?.label ?? importance}
    </span>
  )
}
