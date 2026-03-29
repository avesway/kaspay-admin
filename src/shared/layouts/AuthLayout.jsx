import { Outlet } from 'react-router';

const AuthLayout = () => {
  return (
    <main className="bg-background w-full h-screen flex items-center justify-center">
      <Outlet />
    </main>
  );
};

export default AuthLayout;
