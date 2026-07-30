import { useNavigate } from 'react-router-dom'
import { Trophy } from 'lucide-react'
import { UserAvatar } from '@/components/UserAvatar'
import { useAuthContext } from '@/context/AuthContext'
import { useUser } from '@/hooks/useUsers'

export function UserMenu() {
  const navigate = useNavigate()
  const { user: sessionUser } = useAuthContext()
  const { data: liveUser } = useUser(sessionUser?.id ?? '')
  const user = liveUser ?? sessionUser

  if (!user) return null

  return (
    <button
      type="button"
      onClick={() => navigate('/profile')}
      className="flex items-center gap-2 rounded-lg px-1.5 py-1 text-left transition-colors hover:bg-accent"
    >
      <UserAvatar src={user.profile_image} seed={user.id ?? user.email} alt={user.name} className="size-8" />
      <div className="hidden flex-col sm:flex">
        <span className="max-w-32 truncate text-sm font-medium text-foreground">{user.name}</span>
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Trophy className="size-3 text-amber-500" />
          {user.total_score} pts
        </span>
      </div>
    </button>
  )
}
