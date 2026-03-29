import { SidebarProvider } from '@/shared/ui/sidebar';
import { Toaster } from '@/shared/ui/sonner';

export function Providers({ children }) {
  return (
    <SidebarProvider>
      {children}
      <Toaster richColors />
    </SidebarProvider>
  );
}
