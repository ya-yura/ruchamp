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
import { createEvent } from '@/lib/data';
import { YandexMapPicker } from '../yandex-map-picker';
import { toast } from 'sonner';
import { Spinner } from '../spinner';
import { revalidateEvents } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { path } from '@/lib/utils/other-utils';
import { Locale } from '@/i18n.config';

const CreateMatchTabs = {
  Name: 'Название и время',
  SportType: 'Вид спорта',
  Criteria: 'Критерии',
  Tickets: 'Проведение и билеты',
} as const;

export const createMatchSchema = z.object({
  name: z.string(),
  start_datetime: z.string(),
  sport_type: z.string(),
  combat_type: z.string(),
  grade: z.string(),
  gender: z.string(),
  age_min: z.number(),
  age_max: z.number(),
  weight: z.number(),
  nominal_time: z.string(),
  mat_vol: z.number(),
  price: z.number(),
  seat_capacity: z.number(),
  price_athlete: z.number(),
});

export type CreateMatchSchema = z.infer<typeof createMatchSchema>;

interface CreateMatchDialogProps {
  token?: string;
  lang: Locale;
  className?: string;
}

export function CreateMatchDialog({
  token,
  lang,
  className,
}: CreateMatchDialogProps) {
  const [tabValue, setTabValue] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<CreateMatchSchema>({
    resolver: zodResolver(createMatchSchema),
    defaultValues: {
      name: '',
      start_datetime: '',
      sport_type: '',
      combat_type: '',
      grade: '',
      gender: '',
      age_min: 0,
      age_max: 0,
      weight: 0,
      nominal_time: '',
      mat_vol: 0,
      price: 0,
      seat_capacity: 0,
      price_athlete: 0,
    },
  });

  const title = form.watch('name');

  const handleTabChange = useCallback((value: string) => {
    setTabValue(value);
  }, []);

  function onSubmit(values: CreateMatchSchema): void {
    setIsLoading(true);
    if (token) {
      //   createEvent(token, values)
      //     .then((id) => {
      //       setIsOpen(false);
      //       toast.success(
      //         'Событие успешно создано. Вы будете перенаправлены на него',
      //       );
      //       revalidateEvents();
      //       form.reset();
      //       router.push(path(lang, `/event/${id}/info`));
      //     })
      //     .catch((err) => {
      //       console.log('Ошибка при создании события: ', err);
      //       toast.error('Что-то пошло не так');
      //     })
      //     .finally(() => setIsLoading(false));
    }
  }

  const CreateMatchTabsContent: Record<
    keyof typeof CreateMatchTabs,
    ReactNode
  > = {
    Name: <NameFieldset form={form} />,
    SportType: <NameFieldset form={form} />,
    Criteria: <NameFieldset form={form} />,
    Tickets: <NameFieldset form={form} />,
  } as const;

  return (
    <Dialog onOpenChange={(open: boolean) => setIsOpen(!isOpen)} open={isOpen}>
      <DialogTrigger asChild>
        <Button className={cn(className)} variant={'ruchampDefault'}>
          Создать мероприятие
        </Button>
      </DialogTrigger>
      <DialogContent className="top-[25%] h-fit w-[752px] max-w-[752px] translate-y-[0]">
        <DialogHeader className="absolute left-0 right-0 top-[-92px] flex flex-col">
          <DialogTitle>{title ? title : 'Мероприятие'}</DialogTitle>
        </DialogHeader>
        <Tabs
          className="relative mx-auto w-full"
          value={tabValue}
          onValueChange={handleTabChange}
        >
          <div className="absolute top-[-60px] flex h-[36px] w-full">
            <TabsList className="mx-auto flex h-auto w-fit flex-col justify-between gap-3 bg-transparent text-[#D6D6D6] sm:flex-row lg:w-fit">
              {Object.entries(CreateMatchTabs).map(([key, value]) => (
                <TabsTrigger key={key} value={key}>
                  {value}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <Form {...form}>
            <CustomForm
              onSubmit={form.handleSubmit(onSubmit)}
              className="dark h-fit justify-start bg-transparent py-0 sm:w-full sm:px-3"
            >
              {Object.entries(CreateMatchTabsContent).map(([key, value]) => (
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
                  Создать мероприятие
                </Button>
              </DialogFooter>
            </CustomForm>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function NameFieldset({ form }: { form: UseFormReturn<CreateMatchSchema> }) {
  const nameFieldsetData: TypeFieldsetData<CreateMatchSchema> = {
    fields: [
      {
        type: 'text',
        name: 'name',
        placeholder: 'Название мероприятия',
        label: 'Название',
      },
      {
        type: 'text',
        name: 'start_datetime',
        placeholder: 'Описание мероприятия',
        label: 'Описание',
      },
      {
        type: 'select',
        name: 'nominal_time',
        placeholder: 'Выберите время',
        label: 'Номинальное время проведения одного соревнования',
        fieldStyles: 'w-fit',
        inputStyles: 'w-fit',
        selectOptions: [
          {
            value: '10 минут',
            option: '10 минут',
          },
          {
            value: '20 минут',
            option: '20 минут',
          },
          {
            value: '30 минут',
            option: '30 минут',
          },
          {
            value: '40 минут',
            option: '40 минут',
          },
        ],
      },
    ],
  };

  return (
    <CustomFieldset<CreateMatchSchema>
      form={form}
      fieldsetData={nameFieldsetData}
    />
  );
}

// function TimeFieldset({ form }: { form: UseFormReturn<CreateMatchSchema> }) {
//   const timeFieldsetData: TypeFieldsetData<CreateMatchSchema> = {
//     fields: [
//       {
//         type: 'datetime-local',
//         name: 'start_datetime',
//         placeholder: 'Начало события',
//         label: 'Начало события',
//         fieldStyles: 'col-span-6',
//       },
//       {
//         type: 'datetime-local',
//         name: 'end_datetime',
//         placeholder: 'Окончание события',
//         label: 'Окончание события',
//         fieldStyles: 'col-span-6',
//       },
//       {
//         type: 'datetime-local',
//         name: 'start_request_datetime',
//         placeholder: 'Начало приёма заявок на участие',
//         label: 'Начало приёма заявок на участие',
//         fieldStyles: 'col-span-6',
//       },
//       {
//         type: 'datetime-local',
//         name: 'end_request_datetime',
//         placeholder: 'Звершение приёма заявок на участие',
//         label: 'Завершение приёма заявок на участие',
//         fieldStyles: 'col-span-6',
//       },
//     ],
//   };

//   return (
//     <CustomFieldset<CreateMatchSchema>
//       className="gap-10"
//       form={form}
//       fieldsetData={timeFieldsetData}
//     />
//   );
// }

// interface LocationFieldsetProps {
//   form: UseFormReturn<CreateMatchSchema>;
//   coordinates: [number, number];
//   setCoordinates: Dispatch<SetStateAction<[number, number]>>;
// }

// function LocationFieldset({
//   form,
//   coordinates,
//   setCoordinates,
// }: LocationFieldsetProps) {
//   const locationFieldsetData: TypeFieldsetData<CreateMatchSchema> = {
//     fields: [
//       {
//         type: 'text',
//         name: 'location',
//         placeholder: 'Адрес',
//         label: 'Адрес',
//       },
//       {
//         type: 'text',
//         name: 'geo',
//         placeholder: 'Координаты',
//         label: 'Выберите кооординаты на карте',
//         inputStyles: 'hidden',
//       },
//     ],
//   };

//   return (
//     <>
//       <CustomFieldset<CreateMatchSchema>
//         form={form}
//         fieldsetData={locationFieldsetData}
//       />
//       <YandexMapPicker
//         mapId="createEvent"
//         className="mt-5"
//         coordinates={coordinates}
//         setCoordinates={setCoordinates}
//       />
//     </>
//   );
// }

// function DocsFieldset({ form }: { form: UseFormReturn<CreateMatchSchema> }) {
//   const docsFieldsetData: TypeFieldsetData<CreateMatchSchema> = {
//     fields: [
//       {
//         type: 'file',
//         name: 'event_order',
//         placeholder: 'Загрузить устав',
//         label: 'Загрузить устав',
//       },
//       {
//         type: 'file',
//         name: 'event_system',
//         placeholder: 'Заргрузить отчёт',
//         label: 'Загрузить отчёт',
//       },
//     ],
//   };

//   return (
//     <CustomFieldset<CreateMatchSchema>
//       form={form}
//       fieldsetData={docsFieldsetData}
//     />
//   );
// }
