'use client';

import React, { ReactNode, useState } from 'react';
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
import { useRouter } from 'next/navigation';
import { path } from '@/lib/utils/other-utils';
import { Locale } from '@/i18n.config';
import { createTeam } from '@/lib/data';
import { revalidateTeams } from '@/lib/actions';
import { AllRegions, Countries } from '@/lib/definitions';

export const createTeamSchema = z.object({
  name: z.string().min(1, 'Это обязательное поле'),
  description: z.string().min(10, {
    message: 'Минимальная длина описания – 10 символов',
  }),
  image_field: z.string(), // as a string yet, but later should be as a file
  country: z.string().min(1, 'Это обязательное поле'),
  region: z.string().min(1, 'Это обязательное поле'),
  city: z.string().min(1, 'Это обязательное поле'),
  slug: z.string(),
});

export type CreateTeamSchema = z.infer<typeof createTeamSchema>;

const CreateTeamFields: Record<string, Partial<keyof CreateTeamSchema>[]> = {
  1: ['name', 'description', 'image_field'],
  2: ['country', 'region', 'city', 'slug'],
};

const CreateTeamTabs: Record<string, string> = {
  1: 'Название и описание',
  2: 'Местоположение',
};

interface CreateTeamDialogProps {
  token?: string;
  lang: Locale;
  className?: string;
}

export function CreateTeamDialog({
  token,
  lang,
  className,
}: CreateTeamDialogProps) {
  const [tabValue, setTabValue] = useState<string>('1');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<CreateTeamSchema>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: '',
      description: '',
      image_field: '',
      country: '',
      region: '',
      city: '',
      slug: '',
    },
  });

  function handleTabChange(value: -1 | 1) {
    setTabValue((prevVal) => Math.max(+prevVal + value, 1).toString());
  }

  async function handleNextClick() {
    const output = await form.trigger(CreateTeamFields[tabValue]);
    if (output) {
      handleTabChange(1);
    }
  }

  function onSubmit(values: CreateTeamSchema): void {
    setIsLoading(true);
    if (token) {
      createTeam(token, values)
        .then((id) => {
          setIsOpen(false);
          toast.success('Команда успешно создана');
          revalidateTeams();
          form.reset();
          setTabValue('1');
        })
        .catch((err) => {
          console.log('Ошибка при создании события: ', err);
          toast.error('Что-то пошло не так');
        })
        .finally(() => setIsLoading(false));
    }
  }

  const CreateTeamTabsContent: Record<keyof typeof CreateTeamTabs, ReactNode> =
    {
      1: <NameFieldset form={form} />,
      2: <LocationFieldset form={form} />,
    };

  return (
    <Dialog onOpenChange={(open: boolean) => setIsOpen(!isOpen)} open={isOpen}>
      <DialogTrigger asChild>
        <Button className={cn(className)} variant={'ruchampDefault'}>
          Создать команду
        </Button>
      </DialogTrigger>
      <DialogContent className="top-[25%] h-fit w-[752px] max-w-[752px] translate-y-[0]">
        <DialogHeader className="absolute left-0 right-0 top-[-92px] flex flex-col">
          <DialogTitle>Команда</DialogTitle>
        </DialogHeader>
        <Tabs className="relative mx-auto w-full" value={tabValue}>
          <div className="absolute top-[-60px] flex h-[36px] w-full">
            <TabsList className="mx-auto flex h-auto w-fit flex-col justify-between gap-3 bg-transparent text-[#D6D6D6] sm:flex-row lg:w-fit">
              {Object.entries(CreateTeamTabs).map(([key, value]) => (
                <TabsTrigger className="cursor-default" key={key} value={key}>
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
              {Object.entries(CreateTeamTabsContent).map(([key, value]) => (
                <TabsContent key={key} value={key}>
                  {value}
                </TabsContent>
              ))}
              <DialogFooter>
                <div className="absolute bottom-[-86px] right-[-24px] flex gap-3">
                  {tabValue !== '1' && (
                    <Button
                      className="text-white"
                      type="button"
                      variant={'ruchampTransparentGreyBorder'}
                      onClick={() => handleTabChange(-1)}
                    >
                      Назад
                    </Button>
                  )}
                  {+tabValue !== Object.keys(CreateTeamTabs).length && (
                    <Button
                      className="text-white"
                      type="button"
                      variant={'ruchampDefault'}
                      disabled={false}
                      onClick={handleNextClick}
                    >
                      Далее
                    </Button>
                  )}
                  {+tabValue === Object.keys(CreateTeamTabs).length && (
                    <Button
                      className="text-white"
                      variant={'ruchampDefault'}
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading && <Spinner className="h-6 w-6" />}
                      Создать
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </CustomForm>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function NameFieldset({ form }: { form: UseFormReturn<CreateTeamSchema> }) {
  const nameFieldsetData: TypeFieldsetData<CreateTeamSchema> = {
    fields: [
      {
        type: 'text',
        name: 'name',
        placeholder: 'Название',
        label: 'Название',
      },
      {
        type: 'textarea',
        name: 'description',
        placeholder: 'Описание',
        label: 'Описание',
        inputStyles: 'h-[250px] min-h-[250px]',
      },
      {
        type: 'text', // later change to file
        name: 'image_field',
        placeholder: 'Функционал будет позже',
        label: 'Аватар',
        isDisabled: true,
      },
    ],
  };

  return (
    <CustomFieldset<CreateTeamSchema>
      form={form}
      fieldsetData={nameFieldsetData}
    />
  );
}

interface LocationFieldsetProps {
  form: UseFormReturn<CreateTeamSchema>;
}

function LocationFieldset({ form }: LocationFieldsetProps) {
  const countryOptions = Object.entries(Countries).map(([key, value]) => ({
    value: key,
    option: value,
  }));
  const regionOptions = Object.entries(AllRegions).map(([key, value]) => ({
    value: key,
    option: value,
  }));

  const locationFieldsetData: TypeFieldsetData<CreateTeamSchema> = {
    fields: [
      {
        type: 'select',
        name: 'country',
        placeholder: 'Выберите из списка',
        label: 'Страна',
        selectOptions: countryOptions,
      },
      {
        type: 'select',
        name: 'region',
        placeholder: 'Выберите из списка',
        label: 'Регион',
        selectOptions: regionOptions,
      },
      {
        type: 'text',
        name: 'city',
        placeholder: 'Город',
        label: 'Город',
      },
      {
        type: 'text',
        name: 'slug',
        placeholder: 'Ссылка (slug)',
        label: 'Ссылка (slug)',
      },
    ],
  };

  return (
    <>
      <CustomFieldset<CreateTeamSchema>
        form={form}
        fieldsetData={locationFieldsetData}
      />
    </>
  );
}
