import {
  CustomFieldset,
  TypeFieldsetData,
} from '@/components/forms/custom-fieldset';
import { Locale } from '@/i18n.config';
import { UseFormReturn } from 'react-hook-form';
import { TypeRegFormSchema } from './register-form';
import { CustomLink } from '@/components/custom-link';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type TypeRegisterStepOneProps = {
  form: UseFormReturn<TypeRegFormSchema>;
  lang: Locale;
  switchStep: (num: 1 | 2 | 3 | 4) => void;
};

const regStepOneFieldset: TypeFieldsetData<TypeRegFormSchema> = {
  fields: [
    {
      type: 'email',
      name: 'user_create.email',
      placeholder: 'Ваша почта',
      label: 'Электронная почта',
      defaultValue: '',
    },
    {
      type: 'password',
      name: 'user_create.password',
      placeholder: 'Ваш пароль',
      label: 'Пароль',
      defaultValue: '',
    },
    {
      type: 'password',
      name: 'user_create.confirmPassword',
      placeholder: 'Повторите пароль',
      label: 'Повторите пароль',
      defaultValue: '',
    },
  ],
};

export function RegisterStepOne({
  form,
  lang,
  switchStep,
}: TypeRegisterStepOneProps) {
  return (
    <>
      <CustomFieldset<TypeRegFormSchema>
        form={form}
        lang={lang}
        fieldsetData={regStepOneFieldset}
      />
      <div className="flex items-center justify-between">
        <Link
          className="transition-opacity duration-300 hover:opacity-70"
          href={`/${lang}/login`}
        >
          <p className="text-xs">Я уже зарегистрирован</p>
        </Link>
        <Button
          size="lg"
          variant="ruchampDefault"
          type="button"
          onClick={async () => {
            const output = await form.trigger([
              'user_create.email',
              'user_create.password',
              'user_create.confirmPassword',
            ]);
            if (output) {
              switchStep(2);
            }
          }}
        >
          Выбрать роль
        </Button>
      </div>
    </>
  );
}
