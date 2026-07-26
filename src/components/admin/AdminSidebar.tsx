import { LayoutDashboard, Package, Recycle } from 'lucide-react'
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

export type AdminSection = 'overview' | 'materials'

interface AdminSidebarProps {
  section: AdminSection
  onSectionChange: (section: AdminSection) => void
}

export function AdminSidebar({ section, onSectionChange }: AdminSidebarProps) {
  return (
    <Sidebar side="left">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Recycle className="size-4" />
          </div>
          <span className="text-sm font-semibold">Painel administrativo</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Geral</SidebarGroupLabel>
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
      </SidebarContent>
    </Sidebar>
  )
}
