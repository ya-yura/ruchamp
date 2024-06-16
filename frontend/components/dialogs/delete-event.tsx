'use client';

import React, { FormEvent, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Spinner } from '../spinner';
import { cn } from '@/lib/utils';
import { deleteEvent } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { Locale } from '@/i18n.config';
import { path } from '@/lib/utils/other-utils';

interface DeleteEventDialogProps {
  eventId?: number;
  token?: string;
  className?: string;
  lang: Locale;
}

export function DeleteEventDialog({
  eventId,
  token,
  className,
  lang,
}: DeleteEventDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  function hangleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    if (token && eventId) {
      deleteEvent(token, eventId)
        .then(() => {
          toast.success('Событие успешно удалено');
          router.push(path(lang, `/org/events`));
        })
        .catch((err) => {
          console.log('Ошибка при удалении события: ', err);
          toast.error('Что-то пошло не так. Событие не удалено');
        })
        .finally(() => {
          setIsLoading(false);
          setIsOpen(false);
        });
    }
  }

  return (
    <Dialog onOpenChange={(open: boolean) => setIsOpen(!isOpen)} open={isOpen}>
      <DialogTrigger asChild>
        <Button
          className={cn(className)}
          variant={'ruchampTransparentGreyBorder'}
        >
          Удалить
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader className="mb-10">
          <DialogTitle className="text-xl">
            Вы уверены, что хотите удалить событие?
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={hangleSubmit}>
          <DialogFooter className="gap-3 sm:justify-center">
            <Button
              variant={'ruchampDefault'}
              type="submit"
              disabled={isLoading}
            >
              {isLoading && <Spinner className="h-6 w-6" />}
              Да
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              variant={'ruchampTransparentGreyBorder'}
              type="button"
            >
              Нет
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
