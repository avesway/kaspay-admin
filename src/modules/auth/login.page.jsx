import React from 'react';

import SvgLogo from '@/shared/SvgLogo';
import { Card } from '@/shared/ui/card';

import AuthForm from './components/AuthForm';

function AuthPage() {
  return (
    <Card className="w-[40%] max-2xl:w-[60%] max-lg:w-[90%]">
      <div className="flex flex-col items-center justify-center">
        <div className="border-sidebar-border flex h-16 items-center gap-2 border-b px-6">
          <SvgLogo size={50} />

          <div>
            <h1 className="text-primary text-xl font-bold">KAS-PAY</h1>
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
