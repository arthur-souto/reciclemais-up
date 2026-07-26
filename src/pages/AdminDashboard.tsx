import { useState } from 'react'
import { LayoutDashboard, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/EmptyState'
import { AdminSidebar, type AdminSection } from '@/components/admin/AdminSidebar'
import { MaterialsSection } from '@/components/admin/MaterialsSection'
import { ProfileSwitcher, type ProfileView } from '@/components/ProfileSwitcher'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useLogout } from '@/hooks/useAuth'

interface AdminDashboardProps {
  view: ProfileView
  onViewChange: (view: ProfileView) => void
}

const SECTION_TITLES: Record<AdminSection, string> = {
  overview: 'Dashboard administrativo',
  materials: 'Materiais',
}

export function AdminDashboard({ view, onViewChange }: AdminDashboardProps) {
  const logout = useLogout()
  const [section, setSection] = useState<AdminSection>('overview')

  return (
    <SidebarProvider>
      <AdminSidebar section={section} onSectionChange={setSection} />
      <SidebarInset>
        <header className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold text-foreground">{SECTION_TITLES[section]}</h1>
          </div>
          <div className="flex items-center gap-3">
            <ProfileSwitcher value={view} onChange={onViewChange} />
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut />
              Sair
            </Button>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-6">
          {section === 'overview' && (
            <EmptyState
              mensagem="O painel administrativo ainda está vazio. Em breve, os indicadores e ferramentas de gestão aparecem aqui."
              icon={LayoutDashboard}
            />
          )}
          {section === 'materials' && <MaterialsSection />}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
