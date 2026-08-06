import { Link, useLocation } from 'react-router-dom'
import { Gift, Home as HomeIcon, LayoutDashboard, MapPin, Package, Recycle, UserRound } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

export type AppSection = 'home' | 'overview' | 'materials' | 'prizes'

interface AppSidebarProps {
  section: AppSection
  onSectionChange: (section: AppSection) => void
  canManageMaterials: boolean
  canManagePrizes: boolean
}

export function AppSidebar({
  section,
  onSectionChange,
  canManageMaterials,
  canManagePrizes,
}: AppSidebarProps) {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const { isMobile, setOpenMobile } = useSidebar()

  function closeMobileSidebar() {
    if (isMobile) setOpenMobile(false)
  }

  function handleSectionChange(next: AppSection) {
    onSectionChange(next)
    closeMobileSidebar()
  }

  return (
    <Sidebar side="left">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Recycle className="size-4" />
          </div>
          <span className="text-sm font-semibold">Recicle+</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Geral</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={isHome && section === 'home'} onClick={() => handleSectionChange('home')}>
                  <HomeIcon />
                  <span>Início</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/pontos-de-coleta'}>
                  <Link to="/pontos-de-coleta" onClick={closeMobileSidebar}>
                    <MapPin />
                    <span>Pontos de coleta</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/profile'}>
                  <Link to="/profile" onClick={closeMobileSidebar}>
                    <UserRound />
                    <span>Meu perfil</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/premios'}>
                  <Link to="/premios" onClick={closeMobileSidebar}>
                    <Gift />
                    <span>Loja de prêmios</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {(canManageMaterials || canManagePrizes) && (
          <SidebarGroup>
            <SidebarGroupLabel>Administração</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {canManageMaterials && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={isHome && section === 'overview'}
                      onClick={() => handleSectionChange('overview')}
                    >
                      <LayoutDashboard />
                      <span>Visão geral</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                {canManageMaterials && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={isHome && section === 'materials'}
                      onClick={() => handleSectionChange('materials')}
                    >
                      <Package />
                      <span>Materiais</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                {canManagePrizes && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={isHome && section === 'prizes'}
                      onClick={() => handleSectionChange('prizes')}
                    >
                      <Gift />
                      <span>Prêmios</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  )
}
