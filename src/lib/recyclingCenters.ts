export interface RecyclingCenter {
  id: number
  lat: number
  lon: number
  name: string
  address: string | null
}

interface OverpassElement {
  id: number
  lat: number
  lon: number
  tags?: Record<string, string>
}

interface OverpassResponse {
  elements: OverpassElement[]
}

// Vários espelhos da Overpass API: se um estiver limitando taxa (429) ou fora
// do ar, tenta o próximo antes de desistir. Isso é o que mais reduz o risco
// de rate limit, já que o limite é por servidor/IP, não global.
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.openstreetmap.fr/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
]

// Cidades menores podem não ter nada cadastrado num raio pequeno, mas ir
// muito longe (ex.: 50km+) multiplica as chamadas à API à toa — dois níveis
// cobrem tanto "no bairro" quanto "na região metropolitana".
const SEARCH_RADII_METERS = [8_000, 25_000]

const CACHE_PREFIX = 'recycling-centers:'

// Arredonda a localização a ~1km — buscas repetidas na mesma região (reload
// da página, remounts) usam o cache em vez de bater na API de novo.
function cacheKey(lat: number, lon: number) {
  return `${CACHE_PREFIX}${lat.toFixed(2)},${lon.toFixed(2)}`
}

function readCache(lat: number, lon: number): RecyclingCenter[] | null {
  try {
    const raw = sessionStorage.getItem(cacheKey(lat, lon))
    return raw ? (JSON.parse(raw) as RecyclingCenter[]) : null
  } catch {
    return null
  }
}

function writeCache(lat: number, lon: number, centers: RecyclingCenter[]) {
  try {
    sessionStorage.setItem(cacheKey(lat, lon), JSON.stringify(centers))
  } catch {
    // sessionStorage indisponível (modo privado, quota cheia etc.) — segue sem cache.
  }
}

function buildAddress(tags: Record<string, string>): string | null {
  const street =
    tags['addr:street'] && tags['addr:housenumber']
      ? `${tags['addr:street']}, ${tags['addr:housenumber']}`
      : (tags['addr:street'] ?? null)

  const parts = [street, tags['addr:suburb'], tags['addr:city'], tags['addr:postcode']].filter(
    (part): part is string => !!part,
  )

  return parts.length > 0 ? parts.join(' - ') : null
}

function toCenters(elements: OverpassElement[]): RecyclingCenter[] {
  return elements.map((element) => ({
    id: element.id,
    lat: element.lat,
    lon: element.lon,
    name: element.tags?.name || element.tags?.operator || 'Ponto de coleta',
    address: buildAddress(element.tags ?? {}),
  }))
}

export class RecyclingCentersRateLimitedError extends Error {
  constructor() {
    super('Muitas consultas ao mapa agora. Tente novamente em instantes.')
    this.name = 'RecyclingCentersRateLimitedError'
  }
}

async function queryOverpass(
  lat: number,
  lon: number,
  radiusMeters: number,
  signal?: AbortSignal,
): Promise<RecyclingCenter[]> {
  const query = `[out:json][timeout:20];node["amenity"="recycling"](around:${radiusMeters},${lat},${lon});out body 30;`
  let wasRateLimited = false

  for (const endpoint of OVERPASS_ENDPOINTS) {
    const url = new URL(endpoint)
    url.searchParams.set('data', query)

    try {
      const response = await fetch(url, { signal })

      if (response.status === 429) {
        wasRateLimited = true
        continue
      }
      if (!response.ok) continue

      const data = (await response.json()) as OverpassResponse
      return toCenters(data.elements)
    } catch (error) {
      if ((error as Error).name === 'AbortError') throw error
      // Espelho fora do ar/inacessível — tenta o próximo.
    }
  }

  if (wasRateLimited) throw new RecyclingCentersRateLimitedError()
  throw new Error('Não foi possível consultar os pontos de coleta agora.')
}

export async function fetchNearbyRecyclingCenters(
  lat: number,
  lon: number,
  signal?: AbortSignal,
): Promise<RecyclingCenter[]> {
  const cached = readCache(lat, lon)
  if (cached) return cached

  for (const radius of SEARCH_RADII_METERS) {
    const centers = await queryOverpass(lat, lon, radius, signal)
    if (centers.length > 0) {
      writeCache(lat, lon, centers)
      return centers
    }
  }

  writeCache(lat, lon, [])
  return []
}
