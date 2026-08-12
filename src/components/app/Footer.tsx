import { Recycle } from "lucide-react";

const footerColumns = [
  { title: "Loja", items: ["Prêmios", "Categorias", "Parceiros", "Novidades"] },
  { title: "Conta", items: ["Meus pontos", "Resgates", "Endereços", "Notificações"] },
  { title: "Suporte", items: ["Central de ajuda", "Termos de uso", "Privacidade", "Contato"] },
]

export function Footer() {
  return (
    <footer className="mt-12 border-t border-border/60 bg-secondary/30 px-4 py-10 sm:px-8 sm:py-14 lg:px-12">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-card p-8 shadow-sm sm:p-10">

        {/* Formas geométricas decorativas */}
        <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-primary/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-14 left-1/4 size-40 rounded-full bg-primary/5 blur-2xl" />

        <div className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Recycle className="size-5" />
              </span>
              <span className="font-heading text-xl font-bold text-foreground">
                Recicle<span className="text-primary">+</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground sm:text-base">
              Transformando reciclagem em recompensa para pessoas e cidades.
            </p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <p className="text-base font-semibold text-foreground">{column.title}</p>
              <ul className="mt-3.5 space-y-2.5 text-sm text-muted-foreground sm:text-base">
                {column.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="relative mt-10 border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            © 2026 Recicle+. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
