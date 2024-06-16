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
import { Toaster, toast } from 'sonner';
import { Spinner } from '../spinner';
import revalidateEvents from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { path } from '@/lib/utils/other-utils';
import { Locale } from '@/i18n.config';

const CreateEventTabs = {
  Name: 'Название',
  Time: 'Время',
  Location: 'Место',
  Docs: 'Документы',
} as const;

type CreateEventTabsKeys =
  (typeof CreateEventTabs)[keyof typeof CreateEventTabs];

const MAX_UPLOAD_SIZE = 1024 * 1024 * 5; // 5MB
const ACCEPTED_IMG_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const ACCEPTED_DOC_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

export const createEventSchema = z.object({
  name: z.string(),
  start_datetime: z.string(),
  end_datetime: z.string(),
  start_request_datetime: z.string(),
  end_request_datetime: z.string(),
  location: z.string(),
  geo: z.string(),
  description: z.string().min(10, {
    message: 'Bio must be at least 10 characters.',
  }),
  event_order: z
    .any()
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, 'File size must be less than 5MB')
    .refine((file) => {
      return ACCEPTED_DOC_FILE_TYPES.includes(file?.type);
    }, 'File must be one of the folling: .pdf, .doc, .docx, .txt'),
  event_system: z
    .any()
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, 'File size must be less than 5MB')
    .refine((file) => {
      return ACCEPTED_DOC_FILE_TYPES.includes(file?.type);
    }, 'File must be one of the folling: .pdf, .doc, .docx, .txt'),
  image: z
    .any()
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, 'File size must be less than 5MB')
    .refine((file) => {
      return ACCEPTED_IMG_FILE_TYPES.includes(file?.type);
    }, 'File must be a .png or .jpg'),
});

export type CreateEventSchema = z.infer<typeof createEventSchema>;

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
  const [tabValue, setTabValue] = useState<string>('');
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

  const handleTabChange = useCallback((value: string) => {
    setTabValue(value);
  }, []);

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
    Name: <NameFieldset form={form} />,
    Time: <TimeFieldset form={form} />,
    Location: (
      <LocationFieldset
        form={form}
        coordinates={coordinates}
        setCoordinates={setCoordinates}
      />
    ),
    Docs: <DocsFieldset form={form} />,
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
        <Tabs
          className="relative mx-auto w-full"
          value={tabValue}
          onValueChange={handleTabChange}
        >
          <div className="absolute top-[-60px] flex h-[36px] w-full">
            <TabsList className="mx-auto flex h-auto w-fit flex-col justify-between gap-3 bg-transparent text-[#D6D6D6] sm:flex-row lg:w-fit">
              {Object.entries(CreateEventTabs).map(([key, value]) => (
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
              {Object.entries(CreateEventTabsContent).map(([key, value]) => (
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
                  Создать событие
                </Button>
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
      {
        type: 'file',
        name: 'image',
        placeholder: 'Картинка',
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
