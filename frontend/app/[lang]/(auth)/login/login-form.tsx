'use client';

import { useEffect, useState } from 'react';
import { useDictionary } from '../../dictionary-provider';
import { useRouter } from 'next/navigation';
import { Locale } from '@/i18n.config';
import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/lib/actions';
import { AuthSwitcher } from '@/components/auth/auth-switcher';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/spinner';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import Link from 'next/link';
import {
  CustomFieldset,
  TypeFieldsetData,
} from '@/components/forms/custom-fieldset';
import { CustomForm } from '@/components/forms/custom-form';
import { ButtonsBlock } from '@/components/auth/buttons-block';

const formSchema = z.object({
  username: z
    .string()
    .regex(
      /^[a-zA-Zа-яА-Я0-9_.+-]+@[a-zA-Zа-яА-Я0-9-]+\.[a-zA-Zа-яА-Я0-9-.]+$/,
    ),
  password: z.string(),
});

const loginFields: TypeFieldsetData<z.infer<typeof formSchema>> = {
  fields: [
    {
      type: 'email',
      name: 'username',
      placeholder: 'Ваша почта',
      label: 'Электронная почта',
      defaultValue: '',
    },
    {
      type: 'password',
      name: 'password',
      placeholder: 'Ваш пароль',
      label: 'Пароль',
      defaultValue: '',
    },
  ],
};

export function LoginForm({ lang }: { lang: Locale }) {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);
  const { page } = useDictionary();
  const router = useRouter();
  const [selectedTabValue, setSelectedTabValue] = useState<string>('login');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  useEffect(() => {
    if (selectedTabValue === 'login') {
      router.push(`/${lang}/login`);
    } else {
      router.push(`/${lang}/register`);
    }
  }, [selectedTabValue]);

  function onTabSelect(value: string): void {
    setSelectedTabValue(value);
  }

  return (
    <Form {...form}>
      <CustomForm action={dispatch}>
        <div className="flex w-auto items-center justify-center">
          <AuthSwitcher
            selectedValue={selectedTabValue}
            onTabSelect={onTabSelect}
          />
        </div>
        <CustomFieldset<z.infer<typeof formSchema>>
          form={form}
          lang={lang}
          fieldsetData={loginFields}
          errorMessage={errorMessage}
        />

        <ButtonsBlock>
          <Link
            className="transition-opacity duration-300 hover:opacity-70 order-1 sm:-order-1"
            href={`/${lang}/forgot-password`}
          >
            <p className="text-xs">Я забыл пароль</p>
          </Link>
          <LoginButton isValid={form.formState.isValid} />
        </ButtonsBlock>
      </CustomForm>
    </Form>
  );
}

function LoginButton({ isValid }: { isValid: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      className="flex gap-3 px-9 w-full sm:w-auto"
      variant="ruchampDefault"
      type="submit"
      disabled={!isValid || pending}
    >
      {pending && <Spinner className="h-6 w-6" />} Войти
    </Button>
  );
}
