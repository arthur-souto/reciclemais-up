import { useNavigate } from 'react-router-dom'
import { AppLayout } from '@/components/app/AppLayout'
import { PrizeCatalog } from '@/components/prizes/PrizeCatalog'
import type { AppSection } from '@/components/app/AppSidebar'

export default function PrizesCatalogPage() {
  const navigate = useNavigate()

  return (
    <AppLayout
      title="Loja de prêmios"
      section="home"
      onSectionChange={(next: AppSection) => navigate(`/?section=${next}`)}
    >
      <div className="w-full border-b border-border/60 px-4 pt-8 pb-8 sm:px-8 sm:pt-14 sm:pb-12 lg:px-12">
        <h1 className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
          Loja de prêmios
        </h1>
        <p className="mt-3 text-base text-muted-foreground sm:mt-4 sm:text-xl lg:max-w-2xl">
          Troque os pontos que você ganhou reciclando por prêmios.
        </p>
      </div>

      <PrizeCatalog />
    </AppLayout>
  )
}