import { Outlet } from 'react-router';

import AppHeader from '../AppHeader';
import AppSidebar from '../AppSidebar';

const DashboardLayout = () => {
  return (
    <div className="flex h-full w-full overflow-hidden">
      <AppSidebar />
      <div className="flex h-full w-[80%] grow flex-col">
        <AppHeader />
        <main className="h-[90%] p-5 whitespace-nowrap">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
