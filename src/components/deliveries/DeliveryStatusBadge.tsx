import { CircleCheck, CircleX, Clock, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DeliveryStatus } from '@/types/delivery'

const STATUS_CONFIG: Record<DeliveryStatus, { label: string; className: string; icon: LucideIcon }> = {
  PENDING: {
    label: 'Pendente',
    className: 'bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300',
    icon: Clock,
  },
  COMPLETED: {
    label: 'Concluída',
    className: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400',
    icon: CircleCheck,
  },
  CANCELED: {
    label: 'Cancelada',
    className: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
    icon: CircleX,
  },
}

interface DeliveryStatusBadgeProps {
  status: DeliveryStatus
  className?: string
}

export function DeliveryStatusBadge({ status, className }: DeliveryStatusBadgeProps) {
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
