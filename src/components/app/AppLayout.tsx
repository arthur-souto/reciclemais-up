import type { ReactNode } from 'react'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { UserMenu } from '@/components/UserMenu'
import { AppSidebar, type AppSection } from '@/components/app/AppSidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useAuthContext } from '@/context/AuthContext'
import { useLogout } from '@/hooks/useAuth'
import { Footer } from './Footer';

interface AppLayoutProps {
  title: string
  section: AppSection
  onSectionChange: (section: AppSection) => void
  children: ReactNode
}

export function AppLayout({ title, section, onSectionChange, children }: AppLayoutProps) {
  const logout = useLogout()
  const { user } = useAuthContext()
  const canManageMaterials = user?.role === 'ADMIN'
  const canManagePrizes = user?.role === 'ADMIN' || user?.role === 'ASSOCIATE'

  return (
    <SidebarProvider>
      <AppSidebar
        section={section}
        onSectionChange={onSectionChange}
        canManageMaterials={canManageMaterials}
        canManagePrizes={canManagePrizes}
      />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-border bg-background/95 px-4 py-3.5 backdrop-blur supports-backdrop-filter:bg-background/80 sm:px-6 sm:py-5">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <SidebarTrigger className="size-9 sm:size-10 [&_svg]:size-5" />
            <h1 className="truncate font-heading text-lg font-semibold text-foreground sm:text-xl">{title}</h1>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <UserMenu />
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </header>

        {children}
        <Footer/>
      </SidebarInset>
    </SidebarProvider>
  )
}
