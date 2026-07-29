export interface GeocodeResult {
  lat: number
  lon: number
  displayName: string
}

interface NominatimResult {
  lat: string
  lon: string
  display_name: string
}

// Remove trechos que endereços geralmente têm mas que geocodificadores não
// conseguem localizar (andar, sala, apto, "CEP" como palavra) e troca
// separadores " - " por vírgula, que o Nominatim interpreta melhor como
// limite entre partes do endereço (rua, bairro, cidade, estado...).
function normalizeAddressQuery(raw: string): string {
  return raw
    .replace(/\b\d+º?\s*andar\b/gi, '')
    .replace(/\bsala\s*\d+\b/gi, '')
    .replace(/\bapto?\.?\s*\d+\b/gi, '')
    .replace(/\bbloco\s*\w+\b/gi, '')
    .replace(/\bconjunto\s*\d+\b/gi, '')
    .replace(/\bcep\b/gi, '')
    .replace(/\s*-\s*/g, ', ')
    .replace(/,\s*,+/g, ',')
    .replace(/\s{2,}/g, ' ')
    .replace(/^[,\s]+|[,\s]+$/g, '')
    .trim()
}

async function searchNominatim(query: string, signal?: AbortSignal): Promise<GeocodeResult | null> {
  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('q', query)
  url.searchParams.set('format', 'json')
  url.searchParams.set('limit', '1')

  const response = await fetch(url, { signal, headers: { Accept: 'application/json' } })
  if (!response.ok) return null

  const results = (await response.json()) as NominatimResult[]
  const [first] = results
  if (!first) return null

  return { lat: Number(first.lat), lon: Number(first.lon), displayName: first.display_name }
}

export async function geocodeAddress(query: string, signal?: AbortSignal): Promise<GeocodeResult | null> {
  const normalized = normalizeAddressQuery(query)
  if (!normalized) return null

  const direct = await searchNominatim(normalized, signal)
  if (direct) return direct

  // Endereços muito específicos (ex.: com CEP ou complementos incomuns) às
  // vezes não batem com nada — vai removendo o trecho final (geralmente o
  // mais específico) até achar um resultado ou sobrar só rua e número.
  const segments = normalized
    .split(',')
    .map((segment) => segment.trim())
    .filter(Boolean)

  for (let end = segments.length - 1; end >= 2; end--) {
    const attempt = segments.slice(0, end).join(', ')
    const result = await searchNominatim(attempt, signal)
    if (result) return result
  }

  return null
}
