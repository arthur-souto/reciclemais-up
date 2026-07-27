import { useState, type ReactNode } from 'react'
import { LogOut, Recycle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProfileSwitcher, type ProfileView } from '@/components/ProfileSwitcher'
import { ThemeToggle } from '@/components/ThemeToggle'
import { AdminDashboard } from '@/pages/AdminDashboard'
import { DeliveriesSection } from '@/components/deliveries/DeliveriesSection'
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
  const { user } = useAuthContext()
  const firstName = user?.name?.split(' ')[0]

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
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut />
            Sair
          </Button>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-1 px-6 pt-10 pb-6">
        <h1 className="text-2xl font-semibold text-foreground">
          Bem-vindo(a) de volta{firstName ? `, ${firstName}` : ''}!
        </h1>
        <p className="text-muted-foreground">Que bom ter você por aqui. Este é o seu espaço no Recicle+.</p>
      </div>

      <DeliveriesSection />
    </div>
  )
}
