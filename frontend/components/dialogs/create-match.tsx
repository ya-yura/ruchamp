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

export const createMatchSchema = z.object({
  name: z.string().min(1, 'Это обязательное поле'),
  start_datetime: z.string().min(1, 'Это обязательное поле'),
  sport_type: z.string().min(1, 'Это обязательное поле'),
  combat_type: z.string().min(1, 'Это обязательное поле'),
  grade: z.string().min(1, 'Это обязательное поле'),
  gender: z.string().min(1, 'Это обязательное поле'),
  age_min: z.number(),
  age_max: z.number(),
  weight: z.number(),
  nominal_time: z.string().min(1, 'Это обязательное поле'),
  mat_vol: z.number(),
  price: z.number(),
  seat_capacity: z.number(),
  price_athlete: z.number(),
});

export type CreateMatchSchema = z.infer<typeof createMatchSchema>;

const CreateMatchFields: Record<string, Partial<keyof CreateMatchSchema>[]> = {
  1: ['name', 'start_datetime', 'nominal_time'],
  2: ['sport_type'],
  3: ['gender', 'age_min', 'age_max', 'weight', 'grade', 'combat_type'],
  4: ['mat_vol', 'price', 'seat_capacity', 'price_athlete'],
};

const CreateMatchTabs: Record<string, string> = {
  1: 'Название и время',
  2: 'Вид спорта',
  3: 'Критерии',
  4: 'Проведение и билеты',
};
interface CreateMatchDialogProps {
  token?: string;
  sportTypes: string[];
  lang: Locale;
  className?: string;
}

export function CreateMatchDialog({
  token,
  sportTypes,
  lang,
  className,
}: CreateMatchDialogProps) {
  const [tabValue, setTabValue] = useState<string>('1');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<CreateMatchSchema>({
    resolver: zodResolver(createMatchSchema),
    defaultValues: {
      name: '',
      start_datetime: '',
      nominal_time: '',
      sport_type: '',
      combat_type: '',
      grade: '',
      gender: '',
      age_min: 0,
      age_max: 0,
      weight: 0,
      mat_vol: 0,
      price: 0,
      seat_capacity: 0,
      price_athlete: 0,
    },
  });

  const title = form.watch('name');

  function handleTabChange(value: -1 | 1) {
    setTabValue((prevVal) => Math.max(+prevVal + value, 1).toString());
  }

  function onSubmit(values: CreateMatchSchema): void {
    // setIsLoading(true);
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
    1: <NameFieldset form={form} />,
    2: <SportTypeFieldset form={form} sportTypes={sportTypes} />,
    3: <NameFieldset form={form} />,
    4: <NameFieldset form={form} />,
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
        <Tabs className="relative mx-auto w-full" value={tabValue}>
          <div className="absolute top-[-60px] flex h-[36px] w-full">
            <TabsList className="mx-auto flex h-auto w-fit flex-col justify-between gap-3 bg-transparent text-[#D6D6D6] sm:flex-row lg:w-fit">
              {Object.entries(CreateMatchTabs).map(([key, value]) => (
                <TabsTrigger className="cursor-default" key={key} value={key}>
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
                <div className="absolute bottom-[-86px] right-[-24px] flex gap-3">
                  <Button
                    className="text-white"
                    variant={'ruchampTransparentGreyBorder'}
                    onClick={() => handleTabChange(-1)}
                  >
                    Назад
                  </Button>
                  {+tabValue === Object.keys(CreateMatchTabs).length ? (
                    <Button
                      className="text-white"
                      variant={'ruchampDefault'}
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading && <Spinner className="h-6 w-6" />}
                      Создать
                    </Button>
                  ) : (
                    <Button
                      className="text-white"
                      variant={'ruchampDefault'}
                      disabled={false}
                      onClick={async () => {
                        const output = await form.trigger(
                          CreateMatchFields[tabValue],
                        );
                        if (output) {
                          handleTabChange(1);
                        }
                      }}
                    >
                      Далее
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

function NameFieldset({ form }: { form: UseFormReturn<CreateMatchSchema> }) {
  const timeSelectOptions = Array.from({ length: 20 }, (_, index) => {
    const res = `${(index + 1) * 10} минут`;
    return {
      value: res,
      option: res,
    };
  });

  const nameFieldsetData: TypeFieldsetData<CreateMatchSchema> = {
    fields: [
      {
        type: 'text',
        name: 'name',
        placeholder: 'Название мероприятия',
        label: 'Название',
      },
      {
        type: 'datetime-local',
        name: 'start_datetime',
        placeholder: 'Начало',
        label: 'Начало',
      },
      {
        type: 'select',
        name: 'nominal_time',
        placeholder: 'Выберите время',
        label: 'Номинальное время проведения одного соревнования',
        fieldStyles: 'w-fit',
        inputStyles: 'w-fit',
        selectOptions: timeSelectOptions,
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

function SportTypeFieldset({
  form,
  sportTypes,
}: {
  form: UseFormReturn<CreateMatchSchema>;
  sportTypes: string[];
}) {
  const sportSelectOptions = sportTypes.map((option) => ({
    value: option,
    option: option,
  }));

  const timeFieldsetData: TypeFieldsetData<CreateMatchSchema> = {
    fields: [
      {
        type: 'select',
        name: 'sport_type',
        placeholder: 'Выберите из списка',
        label: 'Вид спорта',
        fieldStyles: 'w-fit',
        inputStyles: 'w-fit',
        selectOptions: sportSelectOptions,
      },
    ],
  };

  return (
    <CustomFieldset<CreateMatchSchema>
      className="gap-10"
      form={form}
      fieldsetData={timeFieldsetData}
    />
  );
}

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
