import React from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem } from './ui/sidebar';
import { MENU } from '@/constants';
import AppSidebarActiveMenu from './AppSidebarActiveMenu';
import SvgLogo from './SvgLogo';

const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <SvgLogo size={30} />
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">KAS-PAY</h1>
            <p className="text-xs text-sidebar-foreground/60">Админ-панель</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-5 mt-5">
        <SidebarMenu>
          {MENU.map((item) => (
            <SidebarMenuItem key={item.id} className="py-1">
              <AppSidebarActiveMenu href={item.url} icon={item} title={item.title} />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-3"></SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
