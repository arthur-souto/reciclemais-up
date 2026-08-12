import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, Camera, Gift, LayoutDashboard, Leaf, MapPin, Moon, PackageCheck, Recycle, Sun, Sunrise, Trophy } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'
import { Button } from '@/components/ui/button'
import { AppLayout } from '@/components/app/AppLayout'
import { type AppSection } from '@/components/app/AppSidebar'
import { MaterialsSection } from '@/components/admin/MaterialsSection'
import { PrizesSection } from '@/components/admin/PrizesSection'
import { DeliveriesSection } from '@/components/deliveries/DeliveriesSection'
import { useAuthContext } from '@/context/AuthContext'
import awarenessImage from '@/assets/vecteezy_businessman-use-technology-to-reduce-co2-the-idea-for_19939787.jpg'

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
const howItWorks = [
  {
    number: '01',
    icon: Recycle,
    title: 'Separe o material',
    description:
      'Separe materiais recicláveis como papel, plástico, vidro ou metal.',
  },
  {
    number: '02',
    icon: PackageCheck,
    title: 'Registre a entrega',
    description:
      'Informe qual material você reciclou e a quantidade entregue.',
  },
  {
    number: '03',
    icon: Camera,
    title: 'Envie uma evidência',
    description:
      'Adicione uma foto para comprovar sua entrega de material.',
  },
  {
    number: '04',
    icon: Trophy,
    title: 'Ganhe pontos',
    description:
      'Após a aprovação, seus pontos são adicionados à sua conta.',
  },
]

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
          <section className="px-4 pt-6 pb-6 sm:px-8 sm:pt-8 lg:px-12">
            <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-hero via-secondary/60 to-background px-6 py-10 sm:px-10 sm:py-14 lg:px-14">

              {/* Formas geométricas decorativas */}
              <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-primary/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-10 size-56 rounded-full bg-primary/10 blur-3xl" />
              <div className="pointer-events-none absolute right-14 top-10 hidden size-16 rotate-12 rounded-2xl border-2 border-primary/20 sm:block" />
              <div className="pointer-events-none absolute right-40 bottom-12 hidden size-10 rounded-full border-2 border-primary/25 sm:block" />
              <div className="pointer-events-none absolute left-[38%] top-8 hidden size-6 rounded-full bg-primary/25 sm:block" />
              <div className="pointer-events-none absolute left-10 bottom-16 hidden size-8 rotate-45 rounded-lg border-2 border-primary/20 lg:block" />

              <div className="relative flex flex-col items-center gap-10 lg:flex-row lg:gap-16">

                {/* Texto */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wide text-hero-foreground-muted sm:justify-start">
                    <GreetingIcon className="size-4" />
                    {getGreeting()} {firstName ? `, ${firstName}` : ''}
                  </div>

                  <h1 className="font-heading mt-4 text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                    Conecte-se.
                    <br />
                    Recicle.
                    <br />
                    <span className="text-primary">Transforme.</span>
                  </h1>

                  <p className="mt-5 text-lg text-hero-foreground-muted sm:mt-6 sm:text-xl lg:max-w-xl">
                    Que bom ter você por aqui. Acompanhe suas entregas, ganhe pontos e
                    encontre pontos de coleta perto de você.
                  </p>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
                    <Link to="/pontos-de-coleta">
                      <Button size="lg" className="w-full sm:w-auto">
                        <MapPin />
                        Ver pontos de coleta
                        <ArrowRight />
                      </Button>
                    </Link>
                    <Link to="/premios">
                      <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                        <Gift />
                        Loja de prêmios
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Imagem */}
                <div className="flex flex-1 justify-center lg:justify-end">
                  <img
                    src="/illustration.png"
                    alt="Reciclagem"
                    className="w-full max-w-[260px] object-cover sm:max-w-sm lg:max-w-md"
                  />
                </div>

              </div>
            </div>
          </section>

            {/** Banner loja de prêmios */}
          <section className="border-t border-border/50 bg-background px-4 py-12 sm:px-8 sm:py-16 lg:px-12">
            <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-[#4C7A32] p-8 text-primary-foreground shadow-lg sm:p-12">

              {/* Formas geométricas decorativas */}
              <div className="pointer-events-none absolute -right-14 -top-20 size-64 rounded-full bg-white/10 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-24 left-1/4 size-64 rounded-full bg-white/10 blur-3xl" />
              <div className="pointer-events-none absolute right-24 top-8 hidden size-14 rotate-12 rounded-2xl border-2 border-white/20 sm:block" />
              <div className="pointer-events-none absolute left-16 bottom-10 hidden size-9 rounded-full border-2 border-white/25 sm:block" />
              <div className="pointer-events-none absolute right-1/3 bottom-6 hidden size-6 rounded-full bg-white/20 sm:block" />

              <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:text-left">
                <div className="max-w-xl">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide backdrop-blur">
                    <Gift className="size-3.5" />
                    Loja de prêmios
                  </span>

                  <h2 className="font-heading mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                    Troque seus pontos por recompensas de verdade
                  </h2>

                  <p className="mt-2 text-sm text-primary-foreground/85 sm:text-base">
                    Confira os prêmios disponíveis e resgate com os pontos que você já
                    conquistou reciclando.
                  </p>
                </div>

                <Link to="/premios" className="w-full shrink-0 sm:w-auto">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Ver loja de prêmios
                    <ArrowRight />
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          <DeliveriesSection />

          {/** Section como funciona  */}
          <section className="border-t border-border/50 bg-background px-4 py-12 sm:px-8 sm:py-16 lg:px-12">
            <div className="mx-auto max-w-7xl">

              <div className="mb-8 text-center sm:mb-10 sm:text-left">
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                  Como funciona
                </p>

                <h2 className="font-heading mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Recicle e ganhe pontos
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
                {howItWorks.map((step) => {
                  const Icon = step.icon

                  return (
                    <div
                      key={step.number}
                      className="flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6"
                    >
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="size-6" />
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-primary">{step.number}</p>
                        <h3 className="mt-0.5 text-base font-semibold text-foreground">
                          {step.title}
                        </h3>

                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

            </div>
          </section>

          {/** Section de conscientização */}
          <section className="border-t border-border/50 bg-secondary/30 px-4 py-12 sm:px-8 sm:py-16 lg:px-12">
            <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 overflow-hidden rounded-3xl border border-border bg-card shadow-sm lg:flex-row">
              <div className="w-full lg:w-1/2">
                <img
                  src={awarenessImage}
                  alt="Pessoa segurando blocos com as letras ESG, representando compromisso ambiental"
                  className="h-64 w-full object-cover sm:h-80 lg:h-full"
                />
              </div>

              <div className="flex-1 px-6 pb-8 text-center lg:px-4 lg:py-10 lg:pr-12 lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold uppercase tracking-wide text-primary">
                  <Leaf className="size-4" />
                  Conscientização
                </div>

                <h2 className="font-heading mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  Sua ação faz diferença
                </h2>

                <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg lg:max-w-md">
                  Cada material reciclado corretamente reduz o impacto ambiental, poupa
                  recursos naturais e ajuda a construir um futuro mais sustentável para
                  todos. Pequenas atitudes, quando somadas, transformam comunidades inteiras.
                </p>

                <div className="mt-6">
                  <Link to="/pontos-de-coleta">
                    <Button size="lg">
                      <Recycle />
                      Comece agora
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
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