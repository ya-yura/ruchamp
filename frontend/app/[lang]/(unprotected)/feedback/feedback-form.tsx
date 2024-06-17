'use client';

import {
  CustomFieldset,
  TypeFieldsetData,
} from '@/components/forms/custom-fieldset';
import { CustomForm } from '@/components/forms/custom-form';
import { useState } from 'react';
import { Locale } from '@/i18n.config';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/spinner';
import { Form } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ButtonsBlock } from '@/components/auth/buttons-block';
import { CustomLink } from '@/components/custom-link';

const formSchema = z
  .object({
    name: z.string(),
    email: z
      .string()
      .regex(
        /^[a-zA-Zа-яА-Я0-9_.+-]+@[a-zA-Zа-яА-Я0-9-]+\.[a-zA-Zа-яА-Я0-9-.]+$/,
      ),
      message: z.string(),
    });

const feedbackFieldset: TypeFieldsetData<z.infer<typeof formSchema>> = {
  fields: [
    {
      type: 'text',
      name: 'name',
      placeholder: 'Введите имя',
      label: 'Имя',
      defaultValue: '',
    },
    {
      type: 'email',
      name: 'email',
      placeholder: 'Ваша почта',
      label: 'Электронная почта',
      defaultValue: '',
    },
    {
      type: 'textarea',
      name: 'message',
      placeholder: 'Введите сообщение',
      label: 'Сообщение',
      defaultValue: '',
    },
  ],
};

export function FeedbackForm({ lang }: { lang: Locale }) {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>): void {
    setIsLoading(true);
    setErrorMessage('');
    console.log('feedback logic', values);
  }
  return (
    <Form {...form}>
      <CustomForm onSubmit={form.handleSubmit(onSubmit)}>
        <CustomFieldset
          form={form}
          lang={lang}
          fieldsetData={feedbackFieldset}
        />
        <ButtonsBlock>
          <CustomLink
            className="order-1 transition-opacity duration-300 hover:opacity-70 sm:-order-1"
            href={`/`}
            lang={lang}
          >
            <p className="text-xs">На главную</p>
          </CustomLink>
          <Button
            className="flex w-full gap-3 px-9 sm:w-auto"
            variant="ruchampDefault"
            type="submit"
            size="lg"
            disabled={false}
          >
            {false && <Spinner className="h-6 w-6" />}
            Отправить
          </Button>
        </ButtonsBlock>
      </CustomForm>
    </Form>
  );
}
