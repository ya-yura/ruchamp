'use client';

import { useEffect, useState } from 'react';
import { useDictionary } from '../../dictionary-provider';
import { useRouter } from 'next/navigation';
import { Locale } from '@/i18n.config';
import { AuthSwitcher } from '@/components/auth/auth-switcher';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import {
  CustomFieldset,
  TypeFieldsetData,
} from '@/components/forms/custom-fieldset';
import { CustomForm } from '@/components/forms/custom-form';
import { ButtonsBlock } from '@/components/auth/buttons-block';
import { CustomLink } from '@/components/custom-link';
import { authenticate } from '@/lib/actions/auth';
import { path } from '@/lib/utils/other-utils';
import { SubmitActionButton } from '@/components/forms/submit-action-button';
import { useFormState } from 'react-dom';

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
      router.push(path(lang, '/login'));
    } else {
      router.push(path(lang, '/register'));
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
          <CustomLink
            className="order-1 transition-opacity duration-300 hover:opacity-70 sm:-order-1"
            href={`/forgot-password`}
            lang={lang}
          >
            <p className="text-xs">Я забыл пароль</p>
          </CustomLink>
          <SubmitActionButton text={'Войти'} isValid={form.formState.isValid} />
        </ButtonsBlock>
      </CustomForm>
    </Form>
  );
}
