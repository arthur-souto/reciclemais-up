import type { LucideIcon } from 'lucide-react'
import { InboxIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  mensagem?: string
  icon?: LucideIcon
  className?: string
}

export function EmptyState({
  mensagem = 'Nenhum item encontrado.',
  icon: Icon = InboxIcon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 rounded-lg border border-dashed border-border p-6 text-center',
        className,
      )}
    >
      <Icon className="size-6 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{mensagem}</p>
    </div>
  )
}
