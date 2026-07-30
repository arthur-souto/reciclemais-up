// Avatar estilo "bichinho" gerado a partir de uma seed estável (id ou email do
// usuário), sem precisar de chave/autenticação. Usado tanto como fallback de
// imagem quebrada/ausente quanto como padrão sugerido no cadastro.
export function getAvatarUrl(seed: string) {
  return `https://api.dicebear.com/9.x/bottts/svg?seed=${encodeURIComponent(seed)}`
}
