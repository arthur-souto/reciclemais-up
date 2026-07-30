import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { getAvatarUrl } from '@/lib/avatar'

interface UserAvatarProps {
  src?: string | null
  seed: string
  alt: string
  className?: string
}

export function UserAvatar({ src, seed, alt, className }: UserAvatarProps) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  const resolvedSrc = src && !failed ? src : getAvatarUrl(seed)

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      onError={() => setFailed(true)}
      className={cn('shrink-0 rounded-full bg-muted object-cover', className)}
    />
  )
}
