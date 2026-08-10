import type { ReactNode } from 'react'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { UserMenu } from '@/components/UserMenu'
import { AppSidebar, type AppSection } from '@/components/app/AppSidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useAuthContext } from '@/context/AuthContext'
import { useLogout } from '@/hooks/useAuth'

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
        <header className="sticky top-0 z-10 flex items-center  justify-between gap-2 border-b border-border bg-background px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3  ">
            <SidebarTrigger />
            <h1 className="truncate text-lg font-semibold text-foreground">{title}</h1>
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-3">
            <UserMenu />
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </header>

        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
