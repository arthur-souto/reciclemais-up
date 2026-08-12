import { Recycle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-[#20251D] text-[#F4F4F1] px-4 py-6 sm:px-8 lg:px-10">
         <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Recycle className="h-5 w-5" />
              </span>
              <span className="font-heading text-lg font-bold">
                Recicle<span className="text-primary">+</span>
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-[#C7CEC0]">
              Transformando reciclagem em recompensa para pessoas e cidades.
            </p>
          </div>

          {[
            { title: "Loja", items: ["Prêmios", "Categorias", "Parceiros", "Novidades"] },
            { title: "Conta", items: ["Meus pontos", "Resgates", "Endereços", "Notificações"] },
            { title: "Suporte", items: ["Central de ajuda", "Termos de uso", "Privacidade", "Contato"] },
          ].map((column) => (
            <div key={column.title}>
              <p className="text-sm font-semibold">{column.title}</p>
              <ul className="mt-3 space-y-2 text-sm text-[#C7CEC0]">
                {column.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10">
          <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-[#C7CEC0]">
            © 2026 Recicle+. Todos os direitos reservados.
          </p>
        </div>
      </footer>

  )
}
