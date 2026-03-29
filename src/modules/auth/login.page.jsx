import React from 'react';
import AuthForm from './components/AuthForm';
import { Card } from '@/shared/ui/card';
import SvgLogo from '@/shared/SvgLogo';
//type="image/svg+xml"
function AuthPage() {
  return (
    <Card className="w-[30%]">
      <div className="flex items-center justify-center flex-col">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <SvgLogo size={50} />

          <div>
            <h1 className="text-xl font-bold text-primary">KAS-PAY</h1>
          </div>
        </div>

        <div className="mt-5">
          <p>Вход в приложение</p>
        </div>

        <AuthForm />
      </div>
    </Card>
  );
}

export const Component = AuthPage;
