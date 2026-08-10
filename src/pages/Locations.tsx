import { useNavigate } from 'react-router-dom'
import { AppLayout } from '@/components/app/AppLayout'
import { RecyclingCentersSection } from '@/components/home/RecyclingCentersSection'
import type { AppSection } from '@/components/app/AppSidebar'

export default function Locations() {
  const navigate = useNavigate()

  return (
    <AppLayout
      title="Pontos de coleta"
      section="home"
      onSectionChange={(next: AppSection) => navigate(`/?section=${next}`)}
    >
      <div className="w-full border-b border-border/60 bg-secondary px-4 pt-8 pb-8 sm:px-8 sm:pt-14 sm:pb-12 lg:px-12">
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Pontos de coleta perto de você
          </span>

          <h1 className="font-heading mt-3 text-2xl font-bold tracking-tight text-hero-foreground sm:mt-4 sm:text-3xl lg:text-4xl">
            Onde me localizar
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-hero-foreground-muted sm:mt-3 sm:text-base lg:text-lg">
            Veja sua localização no mapa e encontre os pontos de coleta de reciclagem mais
            próximos de você.
          </p>
        </div>
      </div>

      <RecyclingCentersSection />
    </AppLayout>
  )
}