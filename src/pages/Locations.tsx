import { useNavigate } from 'react-router-dom'
import { MapPin, Navigation, Search } from 'lucide-react'
import { AppLayout } from '@/components/app/AppLayout'
import { RecyclingCentersSection } from '@/components/home/RecyclingCentersSection'
import type { AppSection } from '@/components/app/AppSidebar'

export default function Locations() {
  const navigate = useNavigate()

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Seu navegador não suporta localização.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords

        console.log('Latitude:', latitude)
        console.log('Longitude:', longitude)

        // Depois podemos centralizar o mapa nessas coordenadas
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert('Você não permitiu o acesso à sua localização.')
            break

          case error.POSITION_UNAVAILABLE:
            alert('Não foi possível obter sua localização.')
            break

          case error.TIMEOUT:
            alert('A solicitação de localização demorou muito.')
            break

          default:
            alert('Ocorreu um erro ao obter sua localização.')
        }
      }
    )
  }

  return (
    <AppLayout
      title="Pontos de coleta"
      section="home"
      onSectionChange={(next: AppSection) =>
        navigate(`/?section=${next}`)
      }
    >
      <main className="min-h-screen bg-gradient-to-b from-primary/20 via-primary/5 to-background">

        {/* Cabeçalho */}
        <header className="px-4 pt-5 pb-4 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Recicle+
              </p>

              <h1 className="font-heading mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Pontos de coleta
              </h1>
            </div>

            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MapPin className="size-5" />
            </div>
          </div>

          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Encontre locais para reciclar perto de você.
          </p>
        </header>

        {/* Busca */}
        <div className="px-4 pb-4 sm:px-8 lg:px-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="text"
              placeholder="Buscar cidade ou ponto de coleta..."
              className="h-12 w-full rounded-2xl border border-border bg-card pl-11 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
        </div>

        {/* Mapa + pontos */}
        <section className="relative px-4 pb-6 sm:px-8 lg:px-10">
          <RecyclingCentersSection />

          {/* Botão flutuante */}
          <button
            type="button"
            onClick={handleGetLocation}
            aria-label="Usar minha localização"
            className="absolute right-7 top-4 z-10 flex size-12 items-center justify-center rounded-full border border-border bg-card shadow-lg transition hover:scale-105 hover:bg-primary hover:text-primary-foreground sm:right-11"
          >
            <Navigation className="size-5" />
          </button>
        </section>

      </main>
    </AppLayout>
  )
}