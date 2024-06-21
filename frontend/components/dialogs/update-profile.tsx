'use client';

import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Form } from '../ui/form';
import { CustomForm } from '../forms/custom-form';
import { UseFormReturn, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CustomFieldset, TypeFieldsetData } from '../forms/custom-fieldset';
import { toast } from 'sonner';
import { Spinner } from '../spinner';
import { Locale } from '@/i18n.config';
import { YandexMapPicker } from '../yandex-map-picker';
import { revalidateEvent } from '@/lib/actions';
import { updateProfile } from '@/lib/data';
import { Countries } from '@/lib/definitions';

const UpdateProfileTabs = {
  1: 'Основная информация',
};

const user_update = z.object({
  username: z.string(),
  name: z.string(),
  sirname: z.string(),
  fathername: z.string(),
  country: z.string(),
});

export const updateProfileSchema = z.object({
  user_update,
});

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;

interface UpdateProfileDialogProps {
  token?: string;
  username: string;
  name: string;
  sirname: string;
  fathername: string;
  country: number;
  lang: Locale;
  className?: string;
}

export function UpdateProfileDialog({
  token,
  username,
  name,
  sirname,
  fathername,
  country,
  lang,
  className,
}: UpdateProfileDialogProps) {
  const [tabValue, setTabValue] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      user_update: {
        username: username,
        name: name,
        sirname: sirname,
        fathername: fathername,
        country: country.toString(),
      },
    },
  });

  const handleTabChange = useCallback((value: string) => {
    setTabValue(value);
  }, []);

  function onSubmit(values: UpdateProfileSchema): void {
    setIsLoading(true);
    if (token) {
      updateProfile(token, values)
        .then(() => {
          setIsOpen(false);
          toast.success('Событие успешно обновлено');
          // revalidateEvent(eventId);
        })
        .catch((err) => {
          console.log('Ошибка при обновлении события: ', err);
          toast.error('Что-то пошло не так');
        })
        .finally(() => setIsLoading(false));
    }
  }

  const UpdateProfileTabsContent: Record<
    keyof typeof UpdateProfileTabs,
    ReactNode
  > = {
    1: <NameFieldset form={form} />,
  } as const;

  return (
    <Dialog onOpenChange={(open: boolean) => setIsOpen(!isOpen)} open={isOpen}>
      <DialogTrigger asChild>
        <Button className={cn(className)} variant={'ruchampDefault'}>
          Изменить
        </Button>
      </DialogTrigger>
      <DialogContent className="top-[25%] h-fit w-[752px] max-w-[752px] translate-y-[0]">
        <DialogHeader className="absolute left-0 right-0 top-[-92px] flex flex-col">
          <DialogTitle>Изменить профиль</DialogTitle>
        </DialogHeader>
        <Tabs
          className="relative mx-auto w-full"
          value={tabValue}
          onValueChange={handleTabChange}
        >
          <div className="absolute top-[-60px] flex h-[36px] w-full">
            <TabsList className="mx-auto flex h-auto w-fit flex-col justify-between gap-3 bg-transparent text-[#D6D6D6] sm:flex-row lg:w-fit">
              {Object.entries(UpdateProfileTabs).map(([key, value]) => (
                <TabsTrigger key={key} value={key}>
                  {value}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <Form {...form}>
            <CustomForm
              onSubmit={form.handleSubmit(onSubmit)}
              className="dark h-fit justify-start bg-transparent py-0 sm:w-full sm:px-3 sm:py-0"
            >
              {Object.entries(UpdateProfileTabsContent).map(([key, value]) => (
                <TabsContent key={key} value={key}>
                  {value}
                </TabsContent>
              ))}
              <DialogFooter>
                <Button
                  className="absolute bottom-[-86px] right-[-24px] text-white"
                  variant={'ruchampDefault'}
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading && <Spinner className="h-6 w-6" />}
                  Обновить данные
                </Button>
              </DialogFooter>
            </CustomForm>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function NameFieldset({ form }: { form: UseFormReturn<UpdateProfileSchema> }) {
  const countryOptions = Object.entries(Countries).map(([key, value]) => ({
    value: key,
    option: value,
  }));
  const nameFieldsetData: TypeFieldsetData<UpdateProfileSchema> = {
    fields: [
      {
        type: 'text',
        name: 'user_update.username',
        placeholder: 'Юзернейм',
        label: 'Юзернейм',
      },
      {
        type: 'text',
        name: 'user_update.name',
        placeholder: 'Имя',
        label: 'Имя',
      },
      {
        type: 'text',
        name: 'user_update.sirname',
        placeholder: 'Фамилия',
        label: 'Фамилия',
      },
      {
        type: 'text',
        name: 'user_update.fathername',
        placeholder: 'Отчество',
        label: 'Отчество',
      },
      {
        type: 'select',
        name: 'user_update.country',
        placeholder: 'Страна',
        label: 'Страна',
        selectOptions: countryOptions,
      },
    ],
  };

  return (
    <CustomFieldset<UpdateProfileSchema>
      form={form}
      fieldsetData={nameFieldsetData}
    />
  );
}
