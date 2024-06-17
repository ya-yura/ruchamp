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
import { updateEvent } from '@/lib/data';
import { toast } from 'sonner';
import { Spinner } from '../spinner';
import { Locale } from '@/i18n.config';
import { YandexMapPicker } from '../yandex-map-picker';
import { revalidateEvent } from '@/lib/actions';

const UpdateEventTabs = {
  Name: 'Название',
  Time: 'Время',
  Location: 'Место',
} as const;

export const updateEventSchema = z.object({
  name: z.string(),
  start_datetime: z.string(),
  end_datetime: z.string(),
  start_request_datetime: z.string(),
  end_request_datetime: z.string(),
  location: z.string(),
  geo: z.string(),
  description: z.string().min(10, {
    message: 'Минимальная длина описания – 10 символов',
  }),
});

export type UpdateEventSchema = z.infer<typeof updateEventSchema>;

interface UpdateEventDialogProps {
  token?: string;
  eventId: number;
  name: string;
  start_datetime: string;
  end_datetime: string;
  start_request_datetime: string;
  end_request_datetime: string;
  location: string;
  geo: string | null;
  description: string;
  lang: Locale;
  className?: string;
}

export function UpdateEventDialog({
  token,
  eventId,
  name,
  start_datetime,
  end_datetime,
  start_request_datetime,
  end_request_datetime,
  location,
  geo,
  description,
  lang,
  className,
}: UpdateEventDialogProps) {
  const [tabValue, setTabValue] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [coordinates, setCoordinates] = useState<[number, number]>(
    geo
      ? (geo.split(', ').map((i) => +i) as [number, number])
      : [55.751574, 37.573856], // Will be Moscow if geo is null
  );

  const form = useForm<UpdateEventSchema>({
    resolver: zodResolver(updateEventSchema),
    defaultValues: {
      name: name,
      start_datetime: start_datetime,
      end_datetime: end_datetime,
      start_request_datetime: start_request_datetime,
      end_request_datetime: end_request_datetime,
      location: location,
      geo: geo || '55.751574, 37.573856',
      description: description,
    },
  });

  useEffect(() => {
    form.setValue('geo', coordinates.join(', '));
  }, [coordinates]);

  const handleTabChange = useCallback((value: string) => {
    setTabValue(value);
  }, []);

  function onSubmit(values: UpdateEventSchema): void {
    setIsLoading(true);
    if (token) {
      updateEvent(token, values, eventId)
        .then(() => {
          setIsOpen(false);
          toast.success('Событие успешно обновлено');
          revalidateEvent(eventId);
        })
        .catch((err) => {
          console.log('Ошибка при обновлении события: ', err);
          toast.error('Что-то пошло не так');
        })
        .finally(() => setIsLoading(false));
    }
  }

  const UpdateEventTabsContent: Record<
    keyof typeof UpdateEventTabs,
    ReactNode
  > = {
    Name: <NameFieldset form={form} />,
    Time: <TimeFieldset form={form} />,
    Location: (
      <LocationFieldset
        form={form}
        coordinates={coordinates}
        setCoordinates={setCoordinates}
      />
    ),
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
          <DialogTitle>Изменить событие</DialogTitle>
        </DialogHeader>
        <Tabs
          className="relative mx-auto w-full"
          value={tabValue}
          onValueChange={handleTabChange}
        >
          <div className="absolute top-[-60px] flex h-[36px] w-full">
            <TabsList className="mx-auto flex h-auto w-fit flex-col justify-between gap-3 bg-transparent text-[#D6D6D6] sm:flex-row lg:w-fit">
              {Object.entries(UpdateEventTabs).map(([key, value]) => (
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
              {Object.entries(UpdateEventTabsContent).map(([key, value]) => (
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

function NameFieldset({ form }: { form: UseFormReturn<UpdateEventSchema> }) {
  const nameFieldsetData: TypeFieldsetData<UpdateEventSchema> = {
    fields: [
      {
        type: 'text',
        name: 'name',
        placeholder: 'Название мероприятия',
        label: 'Название',
      },
      {
        type: 'textarea',
        name: 'description',
        placeholder: 'Описание мероприятия',
        label: 'Описание',
        inputStyles: 'h-[250px] min-h-[250px]',
      },
    ],
  };

  return (
    <CustomFieldset<UpdateEventSchema>
      form={form}
      fieldsetData={nameFieldsetData}
    />
  );
}

function TimeFieldset({ form }: { form: UseFormReturn<UpdateEventSchema> }) {
  const timeFieldsetData: TypeFieldsetData<UpdateEventSchema> = {
    fields: [
      {
        type: 'datetime-local',
        name: 'start_datetime',
        placeholder: 'Начало события',
        label: 'Начало события',
        fieldStyles: 'col-span-6',
      },
      {
        type: 'datetime-local',
        name: 'end_datetime',
        placeholder: 'Окончание события',
        label: 'Окончание события',
        fieldStyles: 'col-span-6',
      },
      {
        type: 'datetime-local',
        name: 'start_request_datetime',
        placeholder: 'Начало приёма заявок на участие',
        label: 'Начало приёма заявок на участие',
        fieldStyles: 'col-span-6',
      },
      {
        type: 'datetime-local',
        name: 'end_request_datetime',
        placeholder: 'Звершение приёма заявок на участие',
        label: 'Завершение приёма заявок на участие',
        fieldStyles: 'col-span-6',
      },
    ],
  };

  return (
    <CustomFieldset<UpdateEventSchema>
      className="gap-10"
      form={form}
      fieldsetData={timeFieldsetData}
    />
  );
}

interface LocationFieldsetProps {
  form: UseFormReturn<UpdateEventSchema>;
  coordinates: [number, number];
  setCoordinates: Dispatch<SetStateAction<[number, number]>>;
}

function LocationFieldset({
  form,
  coordinates,
  setCoordinates,
}: LocationFieldsetProps) {
  const locationFieldsetData: TypeFieldsetData<UpdateEventSchema> = {
    fields: [
      {
        type: 'text',
        name: 'location',
        placeholder: 'Адрес',
        label: 'Адрес',
      },
      {
        type: 'text',
        name: 'geo',
        placeholder: 'Координаты',
        label: 'Выберите кооординаты на карте',
        inputStyles: 'hidden',
      },
    ],
  };

  return (
    <>
      <CustomFieldset<UpdateEventSchema>
        form={form}
        fieldsetData={locationFieldsetData}
      />
      <YandexMapPicker
        className="mt-5"
        coordinates={coordinates}
        setCoordinates={setCoordinates}
        mapId="updateEvent"
      />
    </>
  );
}
