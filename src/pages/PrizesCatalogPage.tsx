import { useNavigate } from 'react-router-dom'
import { Coins, Gift, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import { AppLayout } from '@/components/app/AppLayout'
import { PrizeCatalog } from '@/components/prizes/PrizeCatalog'
import type { AppSection } from '@/components/app/AppSidebar'

const highlights = [
  {
    icon: Coins,
    title: 'Pontos por reciclagem',
    description: 'Cada entrega registrada vira pontos direto na sua conta.',
  },
  {
    icon: Gift,
    title: 'Prêmios variados',
    description: 'Produtos e benefícios para trocar pelos seus pontos.',
  },
  {
    icon: ShieldCheck,
    title: 'Resgate seguro',
    description: 'Confirme e acompanhe seus resgates a qualquer momento.',
  },
  {
    icon: Truck,
    title: 'Entrega combinada',
    description: 'Retirada e envio combinados diretamente com o parceiro.',
  },
]

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
      <main className="min-h-screen bg-background">

        {/* Hero */}
        <section className="px-4 pt-6 pb-6 sm:px-8 sm:pt-8 lg:px-12">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-hero via-secondary/60 to-background px-6 py-10 sm:px-10 sm:py-14 lg:px-14">

            {/* Formas geométricas decorativas */}
            <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-primary/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-10 size-56 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute right-14 top-10 hidden size-16 rotate-12 rounded-2xl border-2 border-primary/20 sm:block" />
            <div className="pointer-events-none absolute right-40 bottom-12 hidden size-10 rounded-full border-2 border-primary/25 sm:block" />
            <div className="pointer-events-none absolute left-[38%] top-8 hidden size-6 rounded-full bg-primary/25 sm:block" />
            <div className="pointer-events-none absolute left-10 bottom-16 hidden size-8 rotate-45 rounded-lg border-2 border-primary/20 lg:block" />

            <div className="relative flex flex-col items-center gap-10 lg:flex-row lg:gap-14">
              {/* Texto */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold uppercase tracking-wide text-primary">
                  <Sparkles className="h-4 w-4" />
                  Recicle+
                </div>

                <h1 className="font-heading mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Loja de <span className="text-primary">prêmios</span>
                </h1>

                <p className="mt-4 text-lg leading-relaxed text-hero-foreground-muted sm:text-xl lg:max-w-lg">
                  Troque seus pontos por benefícios e recompensas de verdade.
                </p>
              </div>

              {/* Imagem */}
              <div className="flex flex-1 justify-center lg:justify-end">
                <img
                  src="/Recycling-amico.png"
                  alt="Pessoas reciclando materiais e ganhando recompensas"
                  className="w-full max-w-[260px] object-cover sm:max-w-sm lg:max-w-md"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Faixa de destaques */}
        <section className="px-4 pb-2 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {highlights.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="flex flex-col items-start gap-2 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5"
                >
                  <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <p className="text-sm font-semibold text-foreground sm:text-base">{item.title}</p>
                  <p className="hidden text-xs leading-snug text-muted-foreground sm:block">
                    {item.description}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        <PrizeCatalog />
      </main>
    </AppLayout>
  )
}