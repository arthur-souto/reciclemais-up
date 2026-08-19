// Em dev, o back-end às vezes é acessado via localhost (browser no mesmo PC)
// e às vezes via IP da rede (celular testando pelo Wi-Fi) — sem trocar o
// hostname pra bater com o de quem está acessando, o navegador tenta uma
// origem diferente da atual e a chamada não sai (CORS/conexão recusada).
// Isso só se aplica a hosts locais; em produção a API pode morar num domínio
// diferente do front de propósito, então não mexemos nesse caso.
function isLocalHost(hostname: string) {
  if (hostname === 'localhost' || hostname === '127.0.0.1') return true

  const parts = hostname.split('.').map(Number)
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) return false

  const [a, b] = parts
  return a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)
}

export function resolveApiUrl(rawUrl: string) {
  try {
    const url = new URL(rawUrl)
    if (isLocalHost(url.hostname) && isLocalHost(window.location.hostname)) {
      url.hostname = window.location.hostname
    }
    return url.toString().replace(/\/$/, '')
  } catch {
    return rawUrl
  }
}
