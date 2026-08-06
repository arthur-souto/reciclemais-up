import { CircleCheck, CircleX, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PrizeStatus } from '@/types/prize'

const STATUS_CONFIG: Record<PrizeStatus, { label: string; className: string; icon: LucideIcon }> = {
  ACTIVE: {
    label: 'Ativo',
    className: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400',
    icon: CircleCheck,
  },
  INACTIVE: {
    label: 'Inativo',
    className: 'bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300',
    icon: CircleX,
  },
}

interface PrizeStatusBadgeProps {
  status: PrizeStatus
  className?: string
}

export function PrizeStatusBadge({ status, className }: PrizeStatusBadgeProps) {
  const config = STATUS_CONFIG[status]
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
