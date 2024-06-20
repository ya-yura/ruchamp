import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
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

const MAX_UPLOAD_SIZE = 1024 * 1024 * 5; // 5MB
const ACCEPTED_IMG_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const ACCEPTED_DOC_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

export const createEventSchema = z.object({
  name: z.string().min(1, 'Это обязательное поле'),
  start_datetime: z.string().min(1, 'Это обязательное поле'),
  end_datetime: z.string().min(1, 'Это обязательное поле'),
  start_request_datetime: z.string().min(1, 'Это обязательное поле'),
  end_request_datetime: z.string().min(1, 'Это обязательное поле'),
  location: z.string().min(1, 'Это обязательное поле'),
  geo: z.string().min(1, 'Это обязательное поле'),
  description: z.string().min(10, {
    message: 'Минимальная длина описания – 10 символов',
  }),
  event_order: z
    .any()
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, 'Файл должен быть менее 5MB')
    .refine((file) => {
      return ACCEPTED_DOC_FILE_TYPES.includes(file?.type);
    }, 'Допустимые форматы файлов: .pdf, .doc, .docx, .txt'),
  event_system: z
    .any()
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, 'Файл должен быть менее 5MB')
    .refine((file) => {
      return ACCEPTED_DOC_FILE_TYPES.includes(file?.type);
    }, 'Допустимые форматы файлов: .pdf, .doc, .docx, .txt'),
  image: z
    .any()
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, 'Файл должен быть менее 5MB')
    .refine((file) => {
      return ACCEPTED_IMG_FILE_TYPES.includes(file?.type);
    }, 'Файл должен быть формата .png или .jpg'),
});

export type CreateEventSchema = z.infer<typeof createEventSchema>;

const CreateEventFields: Record<string, Partial<keyof CreateEventSchema>[]> = {
  1: ['name', 'description', 'image'],
  2: [
    'start_datetime',
    'end_datetime',
    'start_request_datetime',
    'end_request_datetime',
  ],
  3: ['location', 'geo'],
  4: ['event_order', 'event_system'],
};

const CreateEventTabs: Record<string, string> = {
  1: 'Название',
  2: 'Время',
  3: 'Место',
  4: 'Документы',
};

interface CreateEventDialogProps {
  token?: string;
  lang: Locale;
  className?: string;
}

export function CreateEventDialog({
  token,
  lang,
  className,
}: CreateEventDialogProps) {
  const [tabValue, setTabValue] = useState<string>('1');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [coordinates, setCoordinates] = useState<[number, number]>([
    55.751574, 37.573856,
  ]);
  const router = useRouter();

  const form = useForm<CreateEventSchema>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      name: '',
      start_datetime: '',
      end_datetime: '',
      start_request_datetime: '',
      end_request_datetime: '',
      location: '',
      geo: '55.751574, 37.573856',
      description: '',
      event_order: '',
      event_system: '',
      image: '',
    },
  });

  useEffect(() => {
    form.setValue('geo', coordinates.join(', '));
  }, [coordinates]);

  function handleTabChange(value: -1 | 1) {
    setTabValue((prevVal) => Math.max(+prevVal + value, 1).toString());
  }

  async function handleNextClick() {
    const output = await form.trigger(CreateEventFields[tabValue]);
    if (output) {
      handleTabChange(1);
    }
  }

  function onSubmit(values: CreateEventSchema): void {
    setIsLoading(true);
    if (token) {
      createEvent(token, values)
        .then((id) => {
          setIsOpen(false);
          toast.success(
            'Событие успешно создано. Вы будете перенаправлены на него',
          );
          revalidateEvents();
          form.reset();
          setTabValue('1');
          router.push(path(lang, `/event/${id}/info`));
        })
        .catch((err) => {
          console.log('Ошибка при создании события: ', err);
          toast.error('Что-то пошло не так');
        })
        .finally(() => setIsLoading(false));
    }
  }

  const CreateEventTabsContent: Record<
    keyof typeof CreateEventTabs,
    ReactNode
  > = {
    1: <NameFieldset form={form} />,
    2: <TimeFieldset form={form} />,
    3: (
      <LocationFieldset
        form={form}
        coordinates={coordinates}
        setCoordinates={setCoordinates}
      />
    ),
    4: <DocsFieldset form={form} />,
  } as const;

  return (
    <Dialog onOpenChange={(open: boolean) => setIsOpen(!isOpen)} open={isOpen}>
      <DialogTrigger asChild>
        <Button className={cn(className)} variant={'ruchampDefault'}>
          Создать событие
        </Button>
      </DialogTrigger>
      <DialogContent className="top-[25%] h-fit w-[752px] max-w-[752px] translate-y-[0]">
        <DialogHeader className="absolute left-0 right-0 top-[-92px] flex flex-col">
          <DialogTitle>Событие</DialogTitle>
        </DialogHeader>
        <Tabs className="relative mx-auto w-full" value={tabValue}>
          <div className="absolute top-[-60px] flex h-[36px] w-full">
            <TabsList className="mx-auto flex h-auto w-fit flex-col justify-between gap-3 bg-transparent text-[#D6D6D6] sm:flex-row lg:w-fit">
              {Object.entries(CreateEventTabs).map(([key, value]) => (
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
              {Object.entries(CreateEventTabsContent).map(([key, value]) => (
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
                  {+tabValue !== Object.keys(CreateEventTabs).length && (
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
                  {+tabValue === Object.keys(CreateEventTabs).length && (
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

function NameFieldset({ form }: { form: UseFormReturn<CreateEventSchema> }) {
  const nameFieldsetData: TypeFieldsetData<CreateEventSchema> = {
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
        type: 'file',
        name: 'image',
        placeholder: 'Афиша',
        label: 'Афиша',
      },
    ],
  };

  return (
    <CustomFieldset<CreateEventSchema>
      form={form}
      fieldsetData={nameFieldsetData}
    />
  );
}

function TimeFieldset({ form }: { form: UseFormReturn<CreateEventSchema> }) {
  const timeFieldsetData: TypeFieldsetData<CreateEventSchema> = {
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
    <CustomFieldset<CreateEventSchema>
      className="gap-10"
      form={form}
      fieldsetData={timeFieldsetData}
    />
  );
}

interface LocationFieldsetProps {
  form: UseFormReturn<CreateEventSchema>;
  coordinates: [number, number];
  setCoordinates: Dispatch<SetStateAction<[number, number]>>;
}

function LocationFieldset({
  form,
  coordinates,
  setCoordinates,
}: LocationFieldsetProps) {
  const locationFieldsetData: TypeFieldsetData<CreateEventSchema> = {
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
      <CustomFieldset<CreateEventSchema>
        form={form}
        fieldsetData={locationFieldsetData}
      />
      <YandexMapPicker
        mapId="createEvent"
        className="mt-5"
        coordinates={coordinates}
        setCoordinates={setCoordinates}
      />
    </>
  );
}

function DocsFieldset({ form }: { form: UseFormReturn<CreateEventSchema> }) {
  const docsFieldsetData: TypeFieldsetData<CreateEventSchema> = {
    fields: [
      {
        type: 'file',
        name: 'event_order',
        placeholder: 'Загрузить устав',
        label: 'Загрузить устав',
      },
      {
        type: 'file',
        name: 'event_system',
        placeholder: 'Заргрузить отчёт',
        label: 'Загрузить отчёт',
      },
    ],
  };

  return (
    <CustomFieldset<CreateEventSchema>
      form={form}
      fieldsetData={docsFieldsetData}
    />
  );
}
