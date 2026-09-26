import React from 'react';

import { MENU } from '@/constants';

import AppSidebarActiveMenu from './AppSidebarActiveMenu';
import SvgLogo from './SvgLogo';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem } from './ui/sidebar';

const AppSidebar = () => {
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <div className="border-sidebar-border flex h-16 items-center gap-2 border-b px-6">
          <SvgLogo size={30} />
          <div>
            <h1 className="text-sidebar-foreground text-lg font-bold">KAS-PAY</h1>
            <p className="text-sidebar-foreground/60 text-xs">Админ-панель</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="mt-5 p-5">
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
