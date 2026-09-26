import React from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router';

import { cn } from '@/lib/utils';

import { SidebarMenuButton, useSidebar } from './ui/sidebar';

const AppSidebarActiveMenu = ({ href, icon, title }) => {
  const { pathname } = useLocation();
  const isActive = pathname === href;
  const { setOpenMobile } = useSidebar();

  const handleNavigation = () => {
    setOpenMobile(false);
  };

  return (
    <SidebarMenuButton asChild>
      <Link
        to={href}
        onClick={handleNavigation}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-5 text-sm font-medium transition-colors',
          isActive
            ? 'bg-sidebar-accent text-sidebar-primary hover:bg-sidebar-accent hover:text-sidebar-primary'
            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
        )}
      >
        <div className="w-6">{<icon.icon size={22} strokeWidth={1.5} />}</div>

        <span>{title}</span>
      </Link>
    </SidebarMenuButton>
  );
};

export default AppSidebarActiveMenu;
