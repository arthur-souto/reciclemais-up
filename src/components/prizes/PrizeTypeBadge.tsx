import { Gift, Percent, Smartphone, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PrizeType } from '@/types/prize'

const TYPE_CONFIG: Record<PrizeType, { label: string; className: string; icon: LucideIcon }> = {
  PHYSICAL: {
    label: 'Físico',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
    icon: Gift,
  },
  DIGITAL: {
    label: 'Digital',
    className: 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400',
    icon: Smartphone,
  },
  DISCOUNT: {
    label: 'Desconto',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
    icon: Percent,
  },
}

interface PrizeTypeBadgeProps {
  type: PrizeType
  className?: string
}

export function PrizeTypeBadge({ type, className }: PrizeTypeBadgeProps) {
  const config = TYPE_CONFIG[type]
  const Icon = config.icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium shadow-sm',
        config.className,
        className,
      )}
    >
      <Icon className="size-3" />
      {config.label}
    </span>
  )
}
