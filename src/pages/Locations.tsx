import { useNavigate } from 'react-router-dom'
import { MapPin, Search } from 'lucide-react'
import { AppLayout } from '@/components/app/AppLayout'
import { RecyclingCentersSection } from '@/components/home/RecyclingCentersSection'
import type { AppSection } from '@/components/app/AppSidebar'

export default function Locations() {
  const navigate = useNavigate()

  return (
    <AppLayout
      title="Pontos de coleta"
      section="home"
      onSectionChange={(next: AppSection) =>
        navigate(`/?section=${next}`)
      }
    >
      <main className="min-h-screen bg-background">

        {/* Cabeçalho */}
        <section className="px-4 pt-6 pb-6 sm:px-8 sm:pt-8 lg:px-12">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-hero via-secondary/60 to-background px-6 py-10 sm:px-10 sm:py-12 lg:px-14">

            {/* Formas geométricas decorativas */}
            <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-primary/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-10 size-56 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute right-16 top-8 hidden size-14 rotate-12 rounded-2xl border-2 border-primary/20 sm:block" />
            <div className="pointer-events-none absolute right-44 bottom-8 hidden size-9 rounded-full border-2 border-primary/25 sm:block" />
            <div className="pointer-events-none absolute left-[40%] top-6 hidden size-6 rounded-full bg-primary/25 sm:block" />

            <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                  Recicle+
                </p>

                <h1 className="font-heading mt-2 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                  Pontos de coleta
                </h1>

                <p className="mx-auto mt-3 max-w-xl text-lg text-hero-foreground-muted sm:mx-0 sm:text-xl">
                  Encontre locais para reciclar perto de você.
                </p>
              </div>

              <div className="flex size-20 shrink-0 items-center justify-center rounded-3xl bg-primary/10 text-primary sm:size-24">
                <MapPin className="size-10 sm:size-12" />
              </div>
            </div>

            {/* Busca */}
            <div className="relative mt-8">
              <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />

              <input
                type="text"
                placeholder="Buscar cidade ou ponto de coleta..."
                className="h-12 w-full rounded-2xl border border-border bg-card pl-12 pr-4 text-base shadow-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>
        </section>

        {/* Mapa + pontos */}
        <section className="px-4 pb-8 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <RecyclingCentersSection />
          </div>
        </section>

      </main>
    </AppLayout>
  )
}