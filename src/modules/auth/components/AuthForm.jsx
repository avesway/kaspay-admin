import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { Field } from '@/shared/ui/field';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

import useAuth from '../hooks/useAuth';

const loginSchema = z.object({
  login: z
    .string()
    .nonempty('Логин обязателен')
    .min(1, 'Логин должен быть не менее 1 символа')
    .max(25, 'Логин должен быть не более 25 символов'),
  password: z
    .string()
    .nonempty('Пароль обязателен')
    .min(1, 'Пароль должен быть не менее 1 символа')
    .max(25, 'Пароль должен быть не более 25 символов'),
  consentProcessingDigitalData: z.boolean().refine((val) => val === true, {
    message: 'Подтвердите согласие',
  }),
});

const AuthForm = () => {
  const { authHandler, loading } = useAuth();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: '',
      password: '',
      consentProcessingDigitalData: false,
    },
  });

  const onSubmit = form.handleSubmit(authHandler);

  return (
    <Form {...form}>
      <form className="mt-10 flex w-[60%] flex-col gap-4 max-md:w-[60%] max-sm:w-[90%]" onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="login"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Логин</FormLabel>
              <FormControl>
                <Input placeholder="Введите логин" type="input" {...field} className="" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <Input placeholder="Введите пароль" type="input" {...field} className="" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="consentProcessingDigitalData"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Field orientation="horizontal">
                  <Checkbox id="terms-checkbox" name="terms-checkbox" checked={field.value} onCheckedChange={field.onChange} />
                  <Label htmlFor="terms-checkbox" className="inline-flex">
                    <span className="inline-block">
                      Я даю согласие на обработку моих цифровых данных в целях регистрации и использования SaaS‑сервиса. Я
                      ознакомлен с{' '}
                      <a
                        href="https://drive.google.com/file/d/1l7dAu7amkqlTfNAK-XSq6cE8vNmvrsIp/view?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#007bff', textDecoration: 'underline', whiteSpace: 'nowrap', display: 'inline' }}
                      >
                        Политикой конфиденциальности
                      </a>
                      .
                    </span>
                  </Label>
                </Field>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="mt-5" disabled={loading}>
          Войти
          {loading && <Loader2 className="animate-spin" />}
        </Button>
      </form>
    </Form>
  );
};

export default AuthForm;
