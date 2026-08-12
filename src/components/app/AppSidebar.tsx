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
        <div className="flex items-center gap-2.5 px-2 py-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <Recycle className="size-5" />
          </div>
          <span className="font-heading text-base font-semibold">Recicle+</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Geral</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  size="lg"
                  isActive={isHome && section === 'home'}
                  onClick={() => handleSectionChange('home')}
                  className="text-[15px] [&_svg]:size-5"
                >
                  <HomeIcon />
                  <span>Início</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild size="lg" isActive={location.pathname === '/pontos-de-coleta'} className="text-[15px] [&_svg]:size-5">
                  <Link to="/pontos-de-coleta" onClick={closeMobileSidebar}>
                    <MapPin />
                    <span>Pontos de coleta</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild size="lg" isActive={location.pathname === '/profile'} className="text-[15px] [&_svg]:size-5">
                  <Link to="/profile" onClick={closeMobileSidebar}>
                    <UserRound />
                    <span>Meu perfil</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild size="lg" isActive={location.pathname === '/premios'} className="text-[15px] [&_svg]:size-5">
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
              <SidebarMenu className="gap-1">
                {canManageMaterials && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      size="lg"
                      isActive={isHome && section === 'overview'}
                      onClick={() => handleSectionChange('overview')}
                      className="text-[15px] [&_svg]:size-5"
                    >
                      <LayoutDashboard />
                      <span>Visão geral</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                {canManageMaterials && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      size="lg"
                      isActive={isHome && section === 'materials'}
                      onClick={() => handleSectionChange('materials')}
                      className="text-[15px] [&_svg]:size-5"
                    >
                      <Package />
                      <span>Materiais</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                {canManagePrizes && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      size="lg"
                      isActive={isHome && section === 'prizes'}
                      onClick={() => handleSectionChange('prizes')}
                      className="text-[15px] [&_svg]:size-5"
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
