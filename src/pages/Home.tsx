import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { LayoutDashboard, MapPin, Moon, Package, Sun, Sunrise, Trophy } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'
import { AppLayout } from '@/components/app/AppLayout'
import { type AppSection } from '@/components/app/AppSidebar'
import { MaterialsSection } from '@/components/admin/MaterialsSection'
import { PrizesSection } from '@/components/admin/PrizesSection'
import { DeliveriesSection } from '@/components/deliveries/DeliveriesSection'
import { useAuthContext } from '@/context/AuthContext'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

function getGreetingIcon() {
  const hour = new Date().getHours()
  if (hour < 12) return Sunrise
  if (hour < 18) return Sun
  return Moon
}

const SECTION_TITLES: Record<AppSection, string> = {
  home: 'Recicle+',
  overview: 'Dashboard administrativo',
  materials: 'Materiais',
  prizes: 'Prêmios',
}

export default function Home() {
  const { user } = useAuthContext()
  const firstName = user?.name?.split(' ')[0]
  const GreetingIcon = getGreetingIcon()
  const [searchParams, setSearchParams] = useSearchParams()
  const [section, setSection] = useState<AppSection>(
    () => (searchParams.get('section') as AppSection | null) ?? 'home',
  )

  useEffect(() => {
    if (searchParams.has('section')) {
      setSearchParams({}, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSectionChange(next: AppSection) {
    setSection(next)
  }

  return (
    <AppLayout title={SECTION_TITLES[section]} section={section} onSectionChange={handleSectionChange}>
      {section === 'home' && (
        <>
          <div className="w-full border-b border-border/60 px-6 pt-14 pb-12 sm:px-8 lg:px-12">
            <div className="flex items-center gap-2 text-sm font-semibold tracking-wide text-primary uppercase">
              <GreetingIcon className="size-4" />
              {getGreeting()}
            </div>
            <h1 className="mt-3 text-balance text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Bem-vindo(a) de volta{firstName ? `, ${firstName}` : ''}!
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-muted-foreground">
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
        <div className="admin-scope flex flex-1 flex-col gap-6 bg-background p-6">
          <EmptyState
            mensagem="O painel administrativo ainda está vazio. Em breve, os indicadores e ferramentas de gestão aparecem aqui."
            icon={LayoutDashboard}
          />
        </div>
      )}

      {section === 'materials' && (
        <div className="admin-scope flex flex-1 flex-col gap-6 bg-background p-6">
          <MaterialsSection />
        </div>
      )}

      {section === 'prizes' && (
        <div className="admin-scope flex flex-1 flex-col gap-6 bg-background p-6">
          <PrizesSection />
        </div>
      )}
    </AppLayout>
  )
}
