'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDictionary } from '../../dictionary-provider';
import { useRouter } from 'next/navigation';
import { CustomLink } from '@/components/custom-link';
import { Locale } from '@/i18n.config';
import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/lib/actions';
// import { useForm } from '@/lib/hooks/useForm';
import { AuthSwitcher } from '@/components/auth/auth-switcher';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/spinner';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { EyeIcon } from '@heroicons/react/24/outline';
import { EyeSlashIcon } from '@heroicons/react/24/outline';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  username: z
    .string()
    .regex(
      /^[a-zA-Zа-яА-Я0-9_.+-]+@[a-zA-Zа-яА-Я0-9-]+\.[a-zA-Zа-яА-Я0-9-.]+$/,
    ),
  password: z.string(),
});

export function LoginForm({ lang }: { lang: Locale }) {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);
  const { page } = useDictionary();
  const router = useRouter();
  const [selectedTabValue, setSelectedTabValue] = useState<string>('login');
  const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false);

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
      <form
        className="relative my-auto flex h-fit w-[464px] flex-col justify-evenly rounded-md bg-white px-9 py-7"
        action={dispatch}
      >
        <div className="mb-6 flex w-auto items-center justify-center">
          <AuthSwitcher
            selectedValue={selectedTabValue}
            onTabSelect={onTabSelect}
          />
        </div>
        <ul className="mb-4 flex flex-col gap-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Электронная почта</FormLabel>
                <FormControl className="relative">
                  <Input placeholder="Ваша почта" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>Пароль</FormLabel>
                <FormControl>
                  <Input
                    type={isPasswordShown ? 'text' : 'password'}
                    placeholder="Ваш пароль"
                    {...field}
                  />
                </FormControl>
                <EyeButton
                  isShown={isPasswordShown}
                  setIsShown={setIsPasswordShown}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </ul>

        {errorMessage && (
          <p className="mb-3 flex items-center gap-2">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            <span className="text-red-400">{errorMessage}</span>
          </p>
        )}
        <div className="flex items-center justify-between">
          <CustomLink
            className="transition-opacity duration-300 hover:opacity-70"
            href="/forgot-password"
            lang={lang}
          >
            <p className="text-xs">Я забыл пароль</p>
          </CustomLink>
          <LoginButton isValid={form.formState.isValid} />
        </div>
      </form>
    </Form>
  );
}

function LoginButton({ isValid }: { isValid: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      className="flex gap-3 px-9"
      variant="ruchampDefault"
      type="submit"
      disabled={!isValid || pending}
    >
      {pending && <Spinner className="h-6 w-6" />} Войти
    </Button>
  );
}

function EyeButton({
  isShown,
  setIsShown,
}: {
  isShown: boolean;
  setIsShown: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <>
      <Button
        className="absolute bottom-2 right-2 h-fit border-none p-0 text-[#616161] hover:bg-transparent hover:text-[#616161] hover:opacity-80"
        type="button"
        variant="ruchampTransparent"
        onClick={() => setIsShown(!isShown)}
      >
        {isShown ? (
          <EyeSlashIcon className="h-6 w-6" />
        ) : (
          <EyeIcon className="h-6 w-6" />
        )}
      </Button>
    </>
  );
}
