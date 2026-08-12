import { useNavigate } from 'react-router-dom'
import { Gift, Sparkles } from 'lucide-react'
import { AppLayout } from '@/components/app/AppLayout'
import { PrizeCatalog } from '@/components/prizes/PrizeCatalog'
import type { AppSection } from '@/components/app/AppSidebar'

export default function PrizesCatalogPage() {
  const navigate = useNavigate()

  return (
    <AppLayout
      title="Loja de prêmios"
      section="home"
      onSectionChange={(next: AppSection) =>
        navigate(`/?section=${next}`)
      }
    >
      <main className="min-h-screen bg-gradient-to-b from-primary/20 via-primary/5 to-background">

        {/* Hero */}
         <div className="min-h-full bg-surface">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 shadow-hero sm:p-12">
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-white/15 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium tracking-wide text-brand-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Recicle+
            </div>

            <h1 className="mt-5 flex items-center gap-3 text-3xl font-semibold tracking-tight text-brand-foreground sm:text-4xl">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 backdrop-blur">
                <Gift className="h-5 w-5" />
              </span>
              Loja de prêmios
            </h1>

            <p className="mt-3 max-w-md text-sm leading-relaxed text-brand-foreground/80 sm:text-base">
              Troque seus pontos por benefícios e recompensas.
            </p>
          </div>
        </section>

        <div className="mt-8">
          <PrizeCatalog />
        </div>
      </div>
    
      </main>
    </AppLayout>
  )
}