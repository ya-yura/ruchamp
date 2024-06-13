import React, { ReactNode, useCallback, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { H4 } from '../text';
import { Form } from '../ui/form';
import { CustomForm } from '../forms/custom-form';
import { UseFormReturn, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CustomFieldset, TypeFieldsetData } from '../forms/custom-fieldset';
import { Locale } from '@/i18n.config';

const CreateEventTabs = {
  Name: 'Название',
  Time: 'Время',
  Location: 'Место',
  Docs: 'Документы',
} as const;

type CreateEventTabsKeys =
  (typeof CreateEventTabs)[keyof typeof CreateEventTabs];

export const createEventSchema = z.object({
  name: z.string(),
  start_datetime: z.string(),
  end_datetime: z.string(),
  start_request_datetime: z.string(),
  end_request_datetime: z.string(),
  location: z.string(),
  organizer_id: z.number(),
  event_order: z.string(),
  event_system: z.string(),
  geo: z.string(),
  description: z
    .string()
    .min(10, {
      message: 'Bio must be at least 10 characters.',
    })
    .max(160, {
      message: 'Bio must not be longer than 30 characters.',
    }),
  image: z.string(),
});

export type CreateEventSchema = z.infer<typeof createEventSchema>;

export function CreateEventDialog({ className }: { className?: string }) {
  const [tabValue, setTabValue] = useState<string>('');

  const form = useForm<CreateEventSchema>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {},
  });

  const CreateEventTabsContent: Record<
    keyof typeof CreateEventTabs,
    ReactNode
  > = {
    Name: <NameFieldset form={form} />,
    Time: 'Время',
    Location: 'Место',
    Docs: 'Документы',
  } as const;

  const handleTabChange = useCallback((value: string) => {
    setTabValue(value);
  }, []);

  function onSubmit(values: CreateEventSchema): void {
    console.log(values);
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

interface NameFieldsetProps {
  form: UseFormReturn<CreateEventSchema>;
}

function NameFieldset({ form }: NameFieldsetProps) {
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
