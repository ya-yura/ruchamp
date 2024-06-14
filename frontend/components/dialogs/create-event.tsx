import React, { ReactNode, useCallback, useState } from 'react';
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
  description: z
    .string()
    .min(10, {
      message: 'Bio must be at least 10 characters.',
    })
    .max(160, {
      message: 'Bio must not be longer than 30 characters.',
    }),
  event_order: z
    // .instanceof(File)
    .any()
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, 'File size must be less than 5MB')
    .refine((file) => {
      return ACCEPTED_DOC_FILE_TYPES.includes(file?.type);
    }, 'File must be one of the folling: .pdf, .doc, .docx, .txt'),
  event_system: z
    // .instanceof(File)
    .any()
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, 'File size must be less than 5MB')
    .refine((file) => {
      return ACCEPTED_DOC_FILE_TYPES.includes(file?.type);
    }, 'File must be one of the folling: .pdf, .doc, .docx, .txt'),
  image: z
    // .instanceof(File)
    .any()
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, 'File size must be less than 5MB')
    .refine((file) => {
      return ACCEPTED_IMG_FILE_TYPES.includes(file?.type);
    }, 'File must be a .png or .jpg'),
});

export type CreateEventSchema = z.infer<typeof createEventSchema>;

export function CreateEventDialog({ className }: { className?: string }) {
  const [tabValue, setTabValue] = useState<string>('');
  // const [files, setFiles] = useState({
  //   image: null,
  //   event_order: null,
  //   event_system: null,
  // });

  const form = useForm<CreateEventSchema>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      name: 'Название',
      start_datetime: '2024-06-15T15:00:00',
      end_datetime: '2024-06-15T15:00:00',
      start_request_datetime: '2024-06-15T15:00:00',
      end_request_datetime: '2024-06-15T15:00:00',
      location: 'адрес',
      geo: '55.755864, 37.617698',
      description: 'Описание балбалалала',
      event_order: '',
      event_system: '',
      image: '',
    },
  });

  const CreateEventTabsContent: Record<
    keyof typeof CreateEventTabs,
    ReactNode
  > = {
    Name: <NameFieldset form={form} />,
    Time: <TimeFieldset form={form} />,
    Location: <LocationFieldset form={form} />,
    Docs: <DocsFieldset form={form} />,
  } as const;

  const handleTabChange = useCallback((value: string) => {
    setTabValue(value);
  }, []);

  function onSubmit(values: CreateEventSchema): void {
    createEvent(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDAzIiwiYXVkIjpbImZhc3RhcGktdXNlcnM6YXV0aCJdLCJleHAiOjE3MTg1NDI4OTN9.nK_Ui9OpI6SJBTuVia2JKzSILlRzpNutVxe1d6s3MQA',
      values,
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={cn(className)} variant={'ruchampDefault'}>
          Создать событие
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[752px] max-w-[752px]">
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
              className="dark bg-transparent py-0 sm:w-full sm:px-3"
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
                >
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
        defaultValue: '',
      },
      {
        type: 'textarea',
        name: 'description',
        placeholder: 'Описание мероприятия',
        label: 'Описание',
        defaultValue: '',
      },
      {
        type: 'file',
        name: 'image',
        placeholder: 'Картинка',
        label: 'Афиша',
        defaultValue: '',
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
        defaultValue: '',
        span: 'col-span-6',
      },
      {
        type: 'datetime-local',
        name: 'end_datetime',
        placeholder: 'Окончание события',
        label: 'Окончание события',
        defaultValue: '',
        span: 'col-span-6',
      },
      {
        type: 'datetime-local',
        name: 'start_request_datetime',
        placeholder: 'Начало приёма заявок на участие',
        label: 'Начало приёма заявок на участие',
        defaultValue: '',
        span: 'col-span-6',
      },
      {
        type: 'datetime-local',
        name: 'end_request_datetime',
        placeholder: 'Звершение приёма заявок на участие',
        label: 'Завершение приёма заявок на участие',
        defaultValue: '',
        span: 'col-span-6',
      },
    ],
  };

  return (
    <CustomFieldset<CreateEventSchema>
      form={form}
      fieldsetData={timeFieldsetData}
    />
  );
}

function LocationFieldset({
  form,
}: {
  form: UseFormReturn<CreateEventSchema>;
}) {
  const locationFieldsetData: TypeFieldsetData<CreateEventSchema> = {
    fields: [
      {
        type: 'text',
        name: 'location',
        placeholder: 'Адрес',
        label: 'Адрес',
        defaultValue: '',
      },
      {
        type: 'text',
        name: 'geo',
        placeholder: 'Координаты',
        label: 'Координаты',
        defaultValue: '',
      },
    ],
  };

  return (
    <CustomFieldset<CreateEventSchema>
      form={form}
      fieldsetData={locationFieldsetData}
    />
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
        defaultValue: '',
      },
      {
        type: 'file',
        name: 'event_system',
        placeholder: 'Заргрузить отчёт',
        label: 'Загрузить отчёт',
        defaultValue: '',
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
