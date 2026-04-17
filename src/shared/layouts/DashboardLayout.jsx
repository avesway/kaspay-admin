import { Outlet } from 'react-router';
import AppSidebar from '../AppSidebar';
import AppHeader from '../AppHeader';

const DashboardLayout = () => {
  return (
    <div className="flex w-full h-full overflow-hidden">
      <AppSidebar />
      <div className="w-[80%] flex flex-col grow h-full">
        <AppHeader />
        <main className="p-5 h-[90%] overflow-x-auto whitespace-nowrap">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
