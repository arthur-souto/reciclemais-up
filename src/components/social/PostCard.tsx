import { Trophy } from 'lucide-react'
import { UserAvatar } from '@/components/UserAvatar'
import { PostMediaGrid } from '@/components/social/PostMediaGrid'
import { formatDateTime, formatRelativeTime } from '@/lib/date'
import type { Post } from '@/types/post'

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const authorName = post.author?.name ?? 'Usuário do Recicle+'

  return (
    <article className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex items-start gap-3">
        <UserAvatar
          src={post.author?.profile_image}
          seed={post.author?.id ?? post.authorId}
          alt={authorName}
          className="size-10 shrink-0 sm:size-11"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="truncate font-semibold text-foreground">{authorName}</span>
            {post.author != null && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Trophy className="size-3 text-amber-500" />
                {post.author.total_score} pts
              </span>
            )}
            <span
              className="shrink-0 text-sm text-muted-foreground"
              title={formatDateTime(post.created_at)}
            >
              · {formatRelativeTime(post.created_at)}
            </span>
          </div>

          {post.content && (
            <p className="mt-1 whitespace-pre-wrap break-words text-[15px] leading-relaxed text-foreground">
              {post.content}
            </p>
          )}

          {post.medias.length > 0 && <PostMediaGrid medias={post.medias} className="mt-3" />}
        </div>
      </div>
    </article>
  )
}
