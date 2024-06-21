'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Form } from '../ui/form';
import { CustomForm } from '../forms/custom-form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CustomFieldset, TypeFieldsetData } from '../forms/custom-fieldset';
import { toast } from 'sonner';
import { Spinner } from '../spinner';
import { Locale } from '@/i18n.config';
import { revalidateUser } from '@/lib/actions';
import Image from 'next/image';
import { updateAthleteImage } from '@/lib/data';

const MAX_UPLOAD_SIZE = 1024 * 1024 * 5; // 5MB
const ACCEPTED_IMG_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

export const updateAthleteImageSchema = z.object({
  image: z
    .any()
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, 'Файл должен быть менее 5MB')
    .refine((file) => {
      return ACCEPTED_IMG_FILE_TYPES.includes(file?.type);
    }, 'Файл должен быть формата .png или .jpg'),
});

export type UpdateAthleteImageSchema = z.infer<typeof updateAthleteImageSchema>;

interface UpdateAthleteImageDialogProps {
  token?: string;
  lang: Locale;
  className?: string;
}

export function UpdateAthleteImageDialog({
  token,
  lang,
  className,
}: UpdateAthleteImageDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const imageFieldsetData: TypeFieldsetData<UpdateAthleteImageSchema> = {
    fields: [
      {
        type: 'file',
        name: 'image',
        placeholder: 'Изображение',
        label: 'Изображение',
      },
    ],
  };

  const form = useForm<UpdateAthleteImageSchema>({
    resolver: zodResolver(updateAthleteImageSchema),
    defaultValues: {
      image: '',
    },
  });

  function onSubmit(values: UpdateAthleteImageSchema): void {
    setIsLoading(true);
    if (token) {
      updateAthleteImage(token, values)
        .then(() => {
          setIsOpen(false);
          toast.success('Изображение успешно обновлено');
          revalidateUser();
        })
        .catch((err) => {
          console.log('Ошибка при обновлении изображения спортсмена: ', err);
          toast.error('Что-то пошло не так');
        })
        .finally(() => setIsLoading(false));
    }
  }

  return (
    <Dialog onOpenChange={(open: boolean) => setIsOpen(!isOpen)} open={isOpen}>
      <DialogTrigger asChild>
        <Button
          className={cn('group', className)}
          variant={'ruchampTransparent'}
        >
          <Image
            className="mr-3 group-hover:invert"
            src={'/images/icons/change-poster.svg'}
            alt=""
            width={20}
            height={20}
          />
          <p className="text-base font-semibold">Обновить фото</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="top-[25%] h-fit w-[752px] max-w-[752px] translate-y-[0]">
        <DialogHeader className="absolute left-0 right-0 top-[-92px] flex flex-col">
          <DialogTitle>Обновить фото</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <CustomForm
            onSubmit={form.handleSubmit(onSubmit)}
            className="dark h-fit justify-start bg-transparent py-0 sm:w-full sm:px-3 sm:py-0"
          >
            <CustomFieldset<UpdateAthleteImageSchema>
              form={form}
              fieldsetData={imageFieldsetData}
            />
            <DialogFooter>
              <Button
                className="absolute bottom-[-86px] right-[-24px] text-white"
                variant={'ruchampDefault'}
                type="submit"
                disabled={isLoading}
              >
                {isLoading && <Spinner className="h-6 w-6" />}
                Обновить
              </Button>
            </DialogFooter>
          </CustomForm>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
