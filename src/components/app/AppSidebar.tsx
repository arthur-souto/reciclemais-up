import { Link, useLocation } from 'react-router-dom'
import { Home as HomeIcon, LayoutDashboard, MapPin, Package, Recycle, UserRound } from 'lucide-react'
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
} from '@/components/ui/sidebar'

export type AppSection = 'home' | 'overview' | 'materials'

interface AppSidebarProps {
  section: AppSection
  onSectionChange: (section: AppSection) => void
  isAdmin: boolean
}

export function AppSidebar({ section, onSectionChange, isAdmin }: AppSidebarProps) {
  const location = useLocation()

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
                <SidebarMenuButton isActive={section === 'home'} onClick={() => onSectionChange('home')}>
                  <HomeIcon />
                  <span>Início</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/pontos-de-coleta'}>
                  <Link to="/pontos-de-coleta">
                    <MapPin />
                    <span>Pontos de coleta</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/profile'}>
                  <Link to="/profile">
                    <UserRound />
                    <span>Meu perfil</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Administração</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={section === 'overview'}
                    onClick={() => onSectionChange('overview')}
                  >
                    <LayoutDashboard />
                    <span>Visão geral</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={section === 'materials'}
                    onClick={() => onSectionChange('materials')}
                  >
                    <Package />
                    <span>Materiais</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  )
}
