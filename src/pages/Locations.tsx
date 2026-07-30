import { useNavigate } from 'react-router-dom'
import { ArrowLeft, LogOut, Recycle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { UserMenu } from '@/components/UserMenu'
import { RecyclingCentersSection } from '@/components/home/RecyclingCentersSection'
import { useLogout } from '@/hooks/useAuth'

export default function Locations() {
  const navigate = useNavigate()
  const logout = useLogout()

  return (
    <div className="min-h-svh w-full bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-6 py-4 sm:px-8 lg:px-12">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" onClick={() => navigate('/')}>
            <ArrowLeft />
            <span className="sr-only">Voltar</span>
          </Button>
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Recycle className="size-5" />
          </div>
          <span className="text-lg font-semibold text-foreground">Recicle+</span>
        </div>
        <div className="flex items-center gap-3">
          <UserMenu />
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut />
            Sair
          </Button>
        </div>
      </header>

      <div className="w-full border-b border-border bg-linear-to-b from-accent/40 to-transparent px-6 pt-12 pb-10 sm:px-8 lg:px-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Onde me localizar
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          Veja sua localização no mapa e encontre os pontos de coleta de reciclagem mais próximos de
          você.
        </p>
      </div>

      <RecyclingCentersSection />
    </div>
  )
}
