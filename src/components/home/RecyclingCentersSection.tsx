import { useEffect, useState } from 'react'
import { ExternalLink, Locate, MapPinned, Navigation, Recycle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { RecyclingCentersMap } from '@/components/home/RecyclingCentersMap'
import {
  fetchNearbyRecyclingCenters,
  RecyclingCentersRateLimitedError,
  type RecyclingCenter,
} from '@/lib/recyclingCenters'

type LocationState =
  | { status: 'idle' }
  | { status: 'locating' }
  | { status: 'denied' }
  | { status: 'unsupported' }
  | { status: 'ready'; lat: number; lon: number }

// Se todos os espelhos da Overpass estiverem limitando taxa, espera um pouco
// e tenta de novo automaticamente antes de mostrar erro pro usuário.
const RATE_LIMIT_RETRY_DELAY_MS = 4_000

export function RecyclingCentersSection() {
  const [location, setLocation] = useState<LocationState>({ status: 'idle' })
  const [centers, setCenters] = useState<RecyclingCenter[] | null>(null)
  const [isLoadingCenters, setIsLoadingCenters] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [focusedCenterId, setFocusedCenterId] = useState<number | null>(null)

  function requestLocation() {
    if (!navigator.geolocation) {
      setLocation({ status: 'unsupported' })
      return
    }

    setLocation({ status: 'locating' })
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ status: 'ready', lat: position.coords.latitude, lon: position.coords.longitude })
      },
      () => {
        setLocation({ status: 'denied' })
      },
    )
  }

  useEffect(() => {
    requestLocation()
  }, [])

  useEffect(() => {
    if (location.status !== 'ready') return
    const readyLocation = location

    const controller = new AbortController()
    let cancelled = false

    async function load(isRetry: boolean) {
      setIsLoadingCenters(true)
      setErrorMessage(null)

      try {
        const result = await fetchNearbyRecyclingCenters(readyLocation.lat, readyLocation.lon, controller.signal)
        if (!cancelled) setCenters(result)
      } catch (error) {
        if ((error as Error).name === 'AbortError') return

        if (error instanceof RecyclingCentersRateLimitedError && !isRetry) {
          await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_RETRY_DELAY_MS))
          if (!cancelled) return load(true)
        }

        if (!cancelled) setErrorMessage((error as Error).message)
      } finally {
        if (!cancelled) setIsLoadingCenters(false)
      }
    }

    load(false)

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [location])

  return (
    <section className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <MapPinned className="size-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground sm:text-2xl">Pontos de coleta perto de você</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Encontramos ecopontos e centros de reciclagem próximos usando sua localização.
          </p>
        </div>

        {location.status === 'ready' && !isLoadingCenters && !errorMessage && centers != null && centers.length > 0 && (
          <span className="shrink-0 rounded-full bg-primary/10 px-3.5 py-1.5 text-sm font-semibold text-primary">
            {centers.length} {centers.length === 1 ? 'ponto encontrado' : 'pontos encontrados'}
          </span>
        )}
      </div>

       <div className="mt-5">
        {(location.status === 'idle' || location.status === 'locating') && (
          <Skeleton className="h-80 w-full rounded-2xl sm:h-96" />
        )}

        {(location.status === 'denied' || location.status === 'unsupported') && (
          <EmptyState
            icon={Locate}
            mensagem={
              location.status === 'unsupported'
                ? 'Seu navegador não suporta geolocalização.'
                : 'Precisamos da sua localização para mostrar pontos de coleta perto de você.'
            }
            className="h-80 justify-center rounded-2xl border border-dashed border-border sm:h-96"
          />
        )}
        {location.status === 'denied' && (
          <div className="mt-4 flex justify-center">
            <Button variant="outline" size="lg" onClick={requestLocation}>
              <Locate />
              Tentar novamente
            </Button>
          </div>
        )}

         {location.status === 'ready' && (
          <>
            {isLoadingCenters && <Skeleton className="h-80 w-full rounded-2xl sm:h-96" />}

            {!isLoadingCenters && errorMessage && (
              <ErrorState
                mensagem={errorMessage}
                onRetry={() => setLocation({ ...location })}
                className="h-80 justify-center rounded-2xl border border-dashed border-border sm:h-96"
              />
            )}

            {!isLoadingCenters && !errorMessage && centers != null && (
              <>
              <div className="relative overflow-hidden rounded-2xl border border-border/60 shadow-sm">
                <RecyclingCentersMap
                  userLocation={{ lat: location.lat, lon: location.lon }}
                  centers={centers}
                  focusedCenterId={focusedCenterId}
                />

                <button
                  type="button"
                  onClick={requestLocation}
                  aria-label="Usar minha localização"
                  className="absolute bottom-4 right-4 z-10 flex size-12 items-center justify-center rounded-full border border-border/60 bg-card/95 text-foreground shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-primary hover:text-primary-foreground active:scale-95"
                >
                  <Navigation className="size-5" />
                </button>
              </div>

                {centers.length === 0 ? (
                  <EmptyState
                    icon={Recycle}
                    mensagem="Nenhum ponto de coleta foi encontrado na sua região ainda."
                    className="mt-4 rounded-2xl border border-dashed border-border"
                  />
                ) : (
                     <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {centers.map((center) => (
                      <button
                        key={center.id}
                        type="button"
                        onClick={() => setFocusedCenterId(center.id)}
                        aria-pressed={focusedCenterId === center.id}
                        className={`flex flex-col gap-2 rounded-2xl border bg-card p-4 text-left shadow-sm transition-all hover:border-primary/50 hover:bg-accent hover:shadow-md ${
                          focusedCenterId === center.id ? 'border-primary ring-1 ring-primary/30' : 'border-border'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                            <Recycle className="size-5 text-primary" />
                          </span>
                          <div className="flex min-w-0 flex-col">
                            <span className="truncate text-base font-semibold text-foreground">{center.name}</span>
                            <span className="truncate text-sm text-muted-foreground">
                              {center.address ?? 'Endereço não informado'}
                            </span>
                          </div>
                        </div>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lon}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(event) => event.stopPropagation()}
                          className="mt-1 inline-flex items-center gap-1.5 self-start text-sm font-medium text-primary hover:underline"
                        >
                          <Navigation className="size-3.5" />
                          Como chegar
                          <ExternalLink className="size-3.5" />
                        </a>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </section>
  )
}
