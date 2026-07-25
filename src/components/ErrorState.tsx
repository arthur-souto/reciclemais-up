import { AlertTriangleIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  mensagem?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  mensagem = 'Não foi possível carregar os dados.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center',
        className,
      )}
    >
      <AlertTriangleIcon className="size-6 text-destructive" />
      <p className="text-sm text-muted-foreground">{mensagem}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  )
}
