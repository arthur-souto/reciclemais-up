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
      <div className="w-full border-b border-border/60 px-6 pt-14 pb-12 sm:px-8 lg:px-12">
        <h1 className="text-balance text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          Loja de prêmios
        </h1>
        <p className="mt-4 max-w-2xl text-xl text-muted-foreground">
          Troque os pontos que você ganhou reciclando por prêmios.
        </p>
      </div>

      <PrizeCatalog />
    </AppLayout>
  )
}
