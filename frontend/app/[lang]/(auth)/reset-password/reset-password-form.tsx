'use client';

import {
  CustomFieldset,
  TypeFieldsetData,
} from '@/components/forms/custom-fieldset';
import { CustomForm } from '@/components/forms/custom-form';
import { useState } from 'react';
import { Locale } from '@/i18n.config';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/spinner';
import { Form } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ButtonsBlock } from '@/components/auth/buttons-block';

const formSchema = z
  .object({
    password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
      message:
        'Пароль должен содержать не менее 8 символов с цифрами и латинскими буквами',
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['user_create.confirmPassword'],
  });

const forgotPasswordFieldset: TypeFieldsetData<z.infer<typeof formSchema>> = {
  fields: [
    {
      type: 'password',
      name: 'password',
      placeholder: 'Ваш новый пароль',
      label: 'Новый пароль',
      defaultValue: '',
    },
    {
      type: 'password',
      name: 'confirmPassword',
      placeholder: 'Повторите пароль',
      label: 'Введите новый пароль ещё раз',
      defaultValue: '',
    },
  ],
};

export function ResetPasswordForm({ lang }: { lang: Locale }) {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
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
          <Link
            className="order-1 transition-opacity duration-300 hover:opacity-70 sm:-order-1"
            href={`/${lang}/login`}
          >
            <p className="text-xs">Я вспомнил пароль</p>
          </Link>
          <Button
            className="flex w-full gap-3 px-9 sm:w-auto"
            variant="ruchampDefault"
            type="submit"
            size="lg"
            disabled={false}
          >
            {false && <Spinner className="h-6 w-6" />}
            Сохранить
          </Button>
        </ButtonsBlock>
      </CustomForm>
    </Form>
  );
}
