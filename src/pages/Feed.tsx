import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Construction, Loader2, Rss } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { AppLayout } from '@/components/app/AppLayout'
import { PostComposer } from '@/components/social/PostComposer'
import { PostCard } from '@/components/social/PostCard'
import { PostSkeleton } from '@/components/social/PostSkeleton'
import { usePostsFeed } from '@/hooks/usePosts'
import type { AppSection } from '@/components/app/AppSidebar'

export default function Feed() {
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = usePostsFeed()
  const posts = data?.pages.flatMap((page) => page.content) ?? []

  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const target = loadMoreRef.current
    if (!target || !hasNextPage) return

    // Dispara a próxima página um pouco antes do fim (rootMargin) pra carregar
    // durante o scroll, e não só quando o usuário já bateu no fundo da lista.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { rootMargin: '400px' },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <AppLayout
      title="Feed"
      section="home"
      onSectionChange={(next: AppSection) => navigate(`/?section=${next}`)}
    >
      <div className="relative overflow-hidden bg-gradient-to-b from-hero via-secondary/25 to-background">
        {/* Formas geométricas decorativas espalhadas por todo o fundo do feed */}
        <div className="pointer-events-none absolute -right-12 -top-10 size-48 rounded-full bg-primary/15 blur-3xl sm:-right-14 sm:size-56" />
        <div className="pointer-events-none absolute -left-10 top-[6%] size-40 rounded-full bg-primary/10 blur-3xl sm:size-48" />
        <div className="pointer-events-none absolute right-8 top-4 hidden size-12 rotate-12 rounded-2xl border-2 border-primary/20 sm:block" />
        <div className="pointer-events-none absolute left-[30%] top-6 hidden size-5 rounded-full border-2 border-primary/25 md:block" />
        <div className="pointer-events-none absolute right-1/4 top-[20%] hidden size-6 rounded-full bg-primary/25 sm:block" />
        <div className="pointer-events-none absolute left-[8%] top-[28%] hidden size-8 rotate-45 rounded-lg border-2 border-primary/20 lg:block" />
        <div className="pointer-events-none absolute -right-16 top-[40%] size-56 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute left-[4%] top-[52%] hidden size-10 rounded-full border-2 border-primary/20 sm:block" />
        <div className="pointer-events-none absolute right-[12%] top-[60%] hidden size-14 rotate-12 rounded-2xl border-2 border-primary/15 md:block" />
        <div className="pointer-events-none absolute -left-14 top-[70%] size-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute right-[8%] top-[82%] hidden size-6 rounded-full bg-primary/25 sm:block" />
        <div className="pointer-events-none absolute left-[20%] top-[90%] hidden size-9 rounded-full border-2 border-primary/20 sm:block" />
        <div className="pointer-events-none absolute -right-10 bottom-0 size-52 rounded-full bg-primary/10 blur-3xl" />

        <section className="relative px-4 py-7 sm:px-8 sm:py-10">
          <div className="mx-auto flex max-w-2xl items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary sm:size-12">
              <Rss className="size-5 sm:size-6" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h2 className="font-heading text-lg font-bold tracking-tight text-foreground sm:text-2xl">
                  Fique por dentro da reciclagem
                </h2>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
                  <Construction className="size-3" />
                  Em desenvolvimento
                </span>
              </div>
              <p className="text-xs text-hero-foreground-muted sm:text-base">
                Dicas de como reciclar, os melhores pontos de coleta e novidades da comunidade.
              </p>
            </div>
          </div>
        </section>

        <div className="relative mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 pb-6 sm:px-8 sm:pb-8">
          <PostComposer />

          {isLoading && (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <PostSkeleton key={index} />
              ))}
            </div>
          )}

          {!isLoading && isError && (
            <ErrorState mensagem="Não foi possível carregar o feed." onRetry={() => refetch()} />
          )}

          {!isLoading && !isError && posts.length === 0 && (
            <EmptyState mensagem="Nenhum post ainda. Seja o primeiro a compartilhar algo!" icon={Rss} />
          )}

          {!isLoading && !isError && posts.length > 0 && (
            <div className="flex flex-col gap-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {hasNextPage && (
            <div ref={loadMoreRef} className="flex justify-center py-4">
              {isFetchingNextPage && <Loader2 className="size-5 animate-spin text-muted-foreground" />}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
