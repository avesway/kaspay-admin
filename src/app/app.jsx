import { Outlet } from 'react-router';

export function App() {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Outlet />
    </div>
  );
}
