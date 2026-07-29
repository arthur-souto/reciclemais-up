export function formatDateTime(isoDate: string | null) {
  if (!isoDate) return '—'
  return new Date(isoDate).toLocaleString('pt-BR')
}

export function formatShortDate(isoDate: string | null) {
  if (!isoDate) return '—'
  return new Date(isoDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}
