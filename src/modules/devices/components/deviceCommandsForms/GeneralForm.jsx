import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/shared/ui/button';
import { DialogClose, DialogFooter } from '@/shared/ui/dialog';
import { Form } from '@/shared/ui/form';

import { sendCommandDevice } from '../../device.processes';

const commandSchema = z.object({
  deviceId: z.string().min(1, 'Обязательно для заполнения'),
  description: z.string().min(1, 'Обязательно для заполнения'),
  type: z.string().min(1, 'Обязательно для заполнения'),
});

const GeneralForm = ({ activeCommand, activeTerminalDevice, loading, setOpen }) => {
  const form = useForm({
    resolver: zodResolver(commandSchema),
    defaultValues: {
      deviceId: activeTerminalDevice.id,
      description: activeCommand.description,
      type: activeCommand.name,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => sendCommandDevice(data, setOpen))} className="mt-5 flex flex-col gap-5">
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Отмена
            </Button>
          </DialogClose>
          <Button type="submit" disabled={loading}>
            Отправить команду
            {loading && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default GeneralForm;
