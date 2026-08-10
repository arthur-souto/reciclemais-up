import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LayoutDashboard, Moon, Sun, Sunrise } from 'lucide-react'
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
         <div className="w-full border-b border-border/60 bg-hero px-4 pt-8 pb-8 sm:px-8 sm:pt-14 sm:pb-12 lg:px-12">
  <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 lg:flex-row lg:gap-12">

    {/* Texto */}
    <div className="flex-1 text-center lg:text-left">
      <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wide text-hero-foreground-muted sm:justify-start sm:text-sm">
        <GreetingIcon className="size-4" />
        {getGreeting()} {firstName ? `, ${firstName}` : ''}
      </div>

      <h1 className="mt-4 text-3xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
        Conecte-se.
        <br />
        Recicle.
        <br />
        <span className="text-primary">Transforme.</span>
      </h1>

      <p className="mt-4 text-base text-hero-foreground-muted sm:mt-5 sm:text-xl lg:max-w-xl">
        Que bom ter você por aqui. Acompanhe suas entregas, ganhe pontos e
        encontre pontos de coleta perto de você.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
        {/* seus botões — w-full no mobile, w-auto a partir do sm */}
      </div>
    </div>

    {/* Imagem */}
    <div className="flex flex-1 justify-center lg:justify-end">
      <img
        src="/illustration.png"
        alt="Reciclagem"
        className="w-full max-w-[220px] object-cover sm:max-w-sm lg:max-w-md"
      />
    </div>

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