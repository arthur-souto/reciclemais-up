import { Briefcase, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type ProfileView = 'professional' | 'personal'

interface ProfileSwitcherProps {
  value: ProfileView
  onChange: (value: ProfileView) => void
}

export function ProfileSwitcher({ value, onChange }: ProfileSwitcherProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-muted p-1">
      <Button
        type="button"
        size="sm"
        variant={value === 'professional' ? 'default' : 'ghost'}
        onClick={() => onChange('professional')}
      >
        <Briefcase />
        Perfil profissional
      </Button>
      <Button
        type="button"
        size="sm"
        variant={value === 'personal' ? 'default' : 'ghost'}
        onClick={() => onChange('personal')}
      >
        <User />
        Perfil de usuário
      </Button>
    </div>
  )
}
