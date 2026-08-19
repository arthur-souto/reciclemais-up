import { Skeleton } from '@/components/ui/skeleton'

export function PostSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex items-start gap-3">
        <Skeleton className="size-10 shrink-0 rounded-full sm:size-11" />
        <div className="flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="mt-1.5 h-4 w-2/3" />
        </div>
      </div>
    </div>
  )
}
