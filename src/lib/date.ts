export function formatDateTime(isoDate: string | null) {
  if (!isoDate) return '—'
  return new Date(isoDate).toLocaleString('pt-BR')
}

export function formatDate(isoDate: string | null) {
  if (!isoDate) return '—'
  return new Date(isoDate).toLocaleDateString('pt-BR')
}

export function formatShortDate(isoDate: string | null) {
  if (!isoDate) return '—'
  return new Date(isoDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// Tempo relativo estilo Instagram/X ("agora", "5min", "3h", "2d"); cai para
// data curta depois de uma semana.
export function formatRelativeTime(isoDate: string | null) {
  if (!isoDate) return '—'
  const diffSeconds = Math.round((Date.now() - new Date(isoDate).getTime()) / 1000)

  if (diffSeconds < 60) return 'agora'
  const diffMinutes = Math.round(diffSeconds / 60)
  if (diffMinutes < 60) return `${diffMinutes}min`
  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h`
  const diffDays = Math.round(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d`
  return formatShortDate(isoDate)
}
