'use client';

import { useEffect, useState } from 'react';
import { switchTitle } from './constants';
import { useRouter } from 'next/navigation';
import { Greetings } from '../../../../components/greetings';
import { Locale } from '@/i18n.config';
import { CustomForm } from '../../../../components/forms/custom-form';
import { RegisterStepOne } from './register-step-one';
import { RegisterStepTwo } from './register-step-two';
import { RegisterStepThree } from './register-step-three';
import { RegisterStepFour } from './register-step-four';
import { Form } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AuthSwitcher } from '@/components/auth/auth-switcher';
import { auth } from '@/lib/api/auth';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { path } from '@/lib/utils/other-utils';

// const athleteSchema = z.object({
//   athlete_weight: z.number(),
//   athlete_height: z.number(),
//   athlete_sport_type: z.array(z.string()),
// });

// const eventOrganizerSchema = z.object({
//   event_organizer_organization_name: z.string(),
//   event_organizer_organization_website: z.string(),
//   event_organizer_organization_contact_email: z.string(),
//   event_organizer_organization_contact_phone: z.string(),
// });

// const spectatorSchema = z.object({
//   spectator_phone_number: z.string(),
// });

// const refereeSchema = z.object({
//   referee_qualification_level: z.string(),
// });

// const sysadminSchema = z.object({
//   sysadmin_phone_number: z.string(),
// });

// const userDataSchema = z.union([
//   athleteSchema,
//   eventOrganizerSchema,
//   spectatorSchema,
//   // sysadminSchema,
//   refereeSchema,
// ]);

const userDataSchema = z.object({
  athlete_country: z.string(),
  athlete_region: z.string(),
  athlete_city: z.string(),
  athlete_weight: z.string(),
  athlete_height: z.string(),
  athlete_sport_type: z.array(z.string()),
  event_organizer_organization_name: z.string(),
  event_organizer_organization_website: z.string(),
  event_organizer_organization_contact_email: z.string(),
  event_organizer_organization_contact_phone: z.string(),
  // .refine(isValidPhoneNumber, { message: 'Неверный формат телефона' }), // if enabled, influence on both
  spectator_phone_number: z.string(),
  // .refine(isValidPhoneNumber, { message: 'Неверный формат телефона' }),
  referee_qualification_level: z.string(),
});

const userCreateSchema = z
  .object({
    email: z
      .string()
      .regex(
        /^[a-zA-Zа-яА-Я0-9_.+-]+@[a-zA-Zа-яА-Я0-9-]+\.[a-zA-Zа-яА-Я0-9-.]+$/,
        { message: 'В адресе должен быть символ @ и точка' },
      ),
    password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
      message:
        'Пароль должен содержать не менее 8 символов с цифрами и латинскими буквами',
    }),
    confirmPassword: z.string(),
    is_active: z.boolean(),
    is_superuser: z.boolean(),
    is_verified: z.boolean(),
    username: z.string().min(1, {
      message: 'Поле "юзернейм" не может быть пустым',
    }),
    name: z.string().min(1, {
      message: 'Поле "имя" не может быть пустым',
    }),
    sirname: z.string().min(1, {
      message: 'Поле "фамилия" не может быть пустым',
    }),
    fathername: z.string().min(1, {
      message: 'Поле "отчество" не может быть пустым',
    }),
    gender: z.string().min(1, {
      message: 'Выберите пол',
    }),
    // country: z.string().min(1, {
    //   message: 'Выберите страну',
    // }),
    birthdate: z.string().min(1, {
      message: 'Выберите дату',
    }),
    role_id: z.enum(['1', '2', '3', '5']),
  })
  .required();

export const regFormSchema = z
  .object({
    user_create: userCreateSchema,
    user_data: z.object({ info: userDataSchema }),
  })
  .refine(
    (data) => data.user_create.password === data.user_create.confirmPassword,
    {
      message: 'Пароли не совпадают',
      path: ['user_create.confirmPassword'],
    },
  );

export type TypeRegFormSchema = z.infer<typeof regFormSchema>;

export function RegisterForm({
  lang,
  sportTypes,
}: {
  lang: Locale;
  sportTypes: string[];
}) {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const router = useRouter();
  const [selectedTabValue, setSelectedTabValue] = useState<string>('register');
  const [greetings, setGreetings] = useState<{
    title: string;
    subtitle: string;
  }>({ title: 'Привет!', subtitle: 'Это страница регистрации.' });
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof regFormSchema>>({
    resolver: zodResolver(regFormSchema),
    defaultValues: {
      user_create: {
        email: '',
        password: '',
        confirmPassword: '',
        is_active: true,
        is_superuser: false,
        is_verified: false,
        username: '',
        name: '',
        sirname: '',
        fathername: '',
        gender: '',
        // country: '',
        birthdate: '',
        role_id: '1',
      },
      user_data: {
        info: {
          athlete_country: '',
          athlete_region: '',
          athlete_city: '',
          athlete_weight: '',
          athlete_height: '',
          athlete_sport_type: [],
          event_organizer_organization_name: '',
          event_organizer_organization_website: '',
          event_organizer_organization_contact_email: '',
          event_organizer_organization_contact_phone: '',
          spectator_phone_number: '',
          // sysadmin_phone_number: '',
          referee_qualification_level: '',
        },
      },
    },
  });

  useEffect(() => {
    if (selectedTabValue === 'login') {
      router.push(path(lang, '/login'));
    } else {
      router.push(path(lang, '/register'));
    }
  }, [selectedTabValue]);

  useEffect(() => {
    switchTitle(step, setGreetings);
  }, [step]);

  function onTabSelect(value: string): void {
    setSelectedTabValue(value);
  }

  function switchStep(step: 1 | 2 | 3 | 4) {
    setStep(step);
  }

  function onSubmit(values: z.infer<typeof regFormSchema>): void {
    setIsLoading(true);
    setErrorMessage('');
    auth
      .register(values)
      .then(() => {
        setIsOpen(true);
        form.reset();
        switchStep(1);
      })
      .catch((err) => {
        console.log('Register error:', err);
        if (+err === 403) {
          return setErrorMessage('Пользователь с такой почтой уже сущестувует');
        }
        setErrorMessage(
          'Произошла ошибка регистрации. Проверьте введённые данные',
        );
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <>
      <Greetings title={greetings.title} subtitle={greetings.subtitle} />
      <Form {...form}>
        <CustomForm onSubmit={form.handleSubmit(onSubmit)}>
          {step === 1 && (
            <>
              <div className="flex w-auto items-center justify-center">
                <AuthSwitcher
                  selectedValue={selectedTabValue}
                  onTabSelect={onTabSelect}
                />
              </div>
              <RegisterStepOne
                form={form}
                lang={lang}
                switchStep={switchStep}
              />
            </>
          )}
          {step === 2 && (
            <RegisterStepTwo form={form} lang={lang} switchStep={switchStep} />
          )}
          {step === 3 && (
            <RegisterStepThree
              form={form}
              lang={lang}
              switchStep={switchStep}
            />
          )}
          {step === 4 && (
            <RegisterStepFour
              form={form}
              lang={lang}
              switchStep={switchStep}
              isLoading={isLoading}
              errorMessage={errorMessage}
              sportTypes={sportTypes}
            />
          )}
        </CustomForm>
      </Form>
      <Dialog modal={true} open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="gap-6 sm:max-w-[425px]">
          <DialogHeader className="gap-4">
            <DialogTitle>Поздравляем!</DialogTitle>
            <DialogDescription>
              Вы успешно зарегистрировались, теперь можно войти на сайт
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex w-full lg:justify-center">
            <Button
              className="text-foreground"
              variant="ruchampTransparentGreyBorder"
              type="button"
              onClick={() => router.push(path(lang, '/'))}
            >
              На главную
            </Button>
            <Button
              variant="ruchampDefault"
              type="button"
              onClick={() => router.push(path(lang, '/login'))}
            >
              На страницу логина
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
