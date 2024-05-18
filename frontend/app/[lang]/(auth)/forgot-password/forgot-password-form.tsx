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

const formSchema = z.object({
  email: z
    .string()
    .regex(
      /^[a-zA-Zа-яА-Я0-9_.+-]+@[a-zA-Zа-яА-Я0-9-]+\.[a-zA-Zа-яА-Я0-9-.]+$/,
    ),
});

const forgotPasswordFieldset: TypeFieldsetData<z.infer<typeof formSchema>> = {
  fields: [
    {
      type: 'email',
      name: 'email',
      placeholder: 'Ваша почта',
      label: 'Электронная почта',
      defaultValue: '',
    },
  ],
};

export function ForgotPasswordForm({ lang }: { lang: Locale }) {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>): void {
    setIsLoading(true);
    setErrorMessage('');
    console.log('forgot password logic', values);
  }
  return (
    <Form {...form}>
      <CustomForm onSubmit={form.handleSubmit(onSubmit)}>
        <CustomFieldset
          form={form}
          lang={lang}
          fieldsetData={forgotPasswordFieldset}
        />
        <ButtonsBlock>
          <CustomLink
            className="order-1 transition-opacity duration-300 hover:opacity-70 sm:-order-1"
            href={`/login`}
            lang={lang}
          >
            <p className="text-xs">Я вспомнил пароль</p>
          </CustomLink>
          <Button
            className="flex w-full gap-3 px-9 sm:w-auto"
            variant="ruchampDefault"
            type="submit"
            size="lg"
            disabled={false}
          >
            {false && <Spinner className="h-6 w-6" />}
            Восстановить
          </Button>
        </ButtonsBlock>
      </CustomForm>
    </Form>
  );
}
