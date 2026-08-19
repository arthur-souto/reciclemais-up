import { cn } from '@/lib/utils'
import type { Media } from '@/types/media'

interface PostMediaGridProps {
  medias: Media[]
  className?: string
}

// Grid clássico Instagram/X: 1 mídia ocupa tudo, 2/4 em colunas iguais,
// 3 usa a primeira maior à esquerda e duas empilhadas à direita.
export function PostMediaGrid({ medias, className }: PostMediaGridProps) {
  if (medias.length === 0) return null

  return (
    <div
      className={cn(
        'grid gap-0.5 overflow-hidden rounded-xl border border-border',
        medias.length === 1 && 'grid-cols-1',
        medias.length >= 2 && 'grid-cols-2',
        className,
      )}
    >
      {medias.map((item, index) => (
        <div
          key={`${item.url}-${index}`}
          className={cn(
            'relative overflow-hidden bg-muted',
            medias.length === 1 && 'max-h-[320px] w-full sm:max-h-[420px] lg:max-h-[520px]',
            medias.length !== 1 && 'aspect-square',
            medias.length === 3 && index === 0 && 'row-span-2 aspect-auto',
          )}
        >
          {item.media === 'VIDEO' ? (
            <video src={item.url} controls className="size-full object-cover" />
          ) : (
            <img src={item.url} alt="" className="size-full object-cover" loading="lazy" />
          )}
        </div>
      ))}
    </div>
  )
}
