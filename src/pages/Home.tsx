import { useState, type ReactNode } from 'react'
import { LogOut, Recycle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/EmptyState'
import { ProfileSwitcher, type ProfileView } from '@/components/ProfileSwitcher'
import { AdminDashboard } from '@/pages/AdminDashboard'
import { useAuthContext } from '@/context/AuthContext'
import { useLogout } from '@/hooks/useAuth'

export default function Home() {
  const { user } = useAuthContext()
  const isAdmin = user?.role === 'ADMIN'
  const [view, setView] = useState<ProfileView>('professional')

  if (isAdmin && view === 'professional') {
    return <AdminDashboard view={view} onViewChange={setView} />
  }

  return (
    <PersonalHome
      switcher={isAdmin ? <ProfileSwitcher value={view} onChange={setView} /> : undefined}
    />
  )
}

function PersonalHome({ switcher }: { switcher?: ReactNode }) {
  const logout = useLogout()

  return (
    <div className="min-h-svh bg-background">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Recycle className="size-5" />
          </div>
          <span className="text-lg font-semibold text-foreground">Recicle+</span>
        </div>
        <div className="flex items-center gap-3">
          {switcher}
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut />
            Sair
          </Button>
        </div>
      </header>

      <main className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-6 py-16 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
          <Sparkles className="size-7" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-foreground">Bem-vindo(a) de volta!</h1>
          <p className="text-muted-foreground">
            Que bom ter você por aqui. Este é o seu espaço no Recicle+.
          </p>
        </div>

        <EmptyState
          mensagem="Estamos preparando novidades para você. Em breve, este espaço vai ganhar vida."
          icon={Sparkles}
          className="w-full"
        />
      </main>
    </div>
  )
}
