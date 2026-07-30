import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LayoutDashboard, LogOut, MapPin, Package, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/EmptyState'
import { ThemeToggle } from '@/components/ThemeToggle'
import { UserMenu } from '@/components/UserMenu'
import { AppSidebar, type AppSection } from '@/components/app/AppSidebar'
import { MaterialsSection } from '@/components/admin/MaterialsSection'
import { DeliveriesSection } from '@/components/deliveries/DeliveriesSection'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useAuthContext } from '@/context/AuthContext'
import { useLogout } from '@/hooks/useAuth'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

const SECTION_TITLES: Record<AppSection, string> = {
  home: 'Início',
  overview: 'Dashboard administrativo',
  materials: 'Materiais',
}

export default function Home() {
  const logout = useLogout()
  const { user } = useAuthContext()
  const isAdmin = user?.role === 'ADMIN'
  const firstName = user?.name?.split(' ')[0]
  const [section, setSection] = useState<AppSection>('home')

  return (
    <SidebarProvider>
      <AppSidebar section={section} onSectionChange={setSection} isAdmin={isAdmin} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-6 py-4">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            {section === 'home' ? (
              <span className="text-lg font-semibold text-foreground">Recicle+</span>
            ) : (
              <h1 className="text-lg font-semibold text-foreground">{SECTION_TITLES[section]}</h1>
            )}
          </div>
          <div className="flex items-center gap-3">
            <UserMenu />
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut />
              Sair
            </Button>
          </div>
        </header>

        {section === 'home' && (
          <>
            <div className="w-full border-b border-border bg-linear-to-b from-accent/40 to-transparent px-6 pt-12 pb-10 sm:px-8 lg:px-12">
              <p className="text-base font-medium text-primary">{getGreeting()} 👋</p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Bem-vindo(a) de volta{firstName ? `, ${firstName}` : ''}!
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
                Que bom ter você por aqui. Acompanhe suas entregas, ganhe pontos e encontre pontos de
                coleta perto de você.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2">
                  <Package className="size-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Registre entregas</span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2">
                  <Trophy className="size-4 text-amber-500" />
                  <span className="text-sm font-medium text-foreground">Ganhe pontos</span>
                </div>
                <Link
                  to="/pontos-de-coleta"
                  className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 transition-colors hover:border-primary/50 hover:bg-accent"
                >
                  <MapPin className="size-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Encontre pontos de coleta</span>
                </Link>
              </div>
            </div>

            <DeliveriesSection />
          </>
        )}

        {section === 'overview' && (
          <main className="flex flex-1 flex-col gap-6 p-6">
            <EmptyState
              mensagem="O painel administrativo ainda está vazio. Em breve, os indicadores e ferramentas de gestão aparecem aqui."
              icon={LayoutDashboard}
            />
          </main>
        )}

        {section === 'materials' && (
          <main className="flex flex-1 flex-col gap-6 p-6">
            <MaterialsSection />
          </main>
        )}
      </SidebarInset>
    </SidebarProvider>
  )
}
