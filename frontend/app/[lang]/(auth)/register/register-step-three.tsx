import { Locale } from '@/i18n.config';
import { UseFormReturn } from 'react-hook-form';
import { TypeRegFormSchema } from './register-form';
import {
  CustomFieldset,
  TypeFieldsetData,
} from '@/components/forms/custom-fieldset';
import { Button } from '@/components/ui/button';
import { ButtonsBlock } from '@/components/auth/buttons-block';

type TypeRegisterStepThreeProps = {
  form: UseFormReturn<TypeRegFormSchema>;
  lang: Locale;
  switchStep: (num: 1 | 2 | 3 | 4) => void;
};

const regStepThreeFieldset: TypeFieldsetData<TypeRegFormSchema> = {
  fields: [
    {
      type: 'text',
      name: 'user_create.name',
      placeholder: 'Введите имя',
      label: 'Имя',
      defaultValue: '',
    },
    {
      type: 'text',
      name: 'user_create.sirname',
      placeholder: 'Ваша фамилия',
      label: 'Фамилия',
      defaultValue: '',
    },
    {
      type: 'text',
      name: 'user_create.fathername',
      placeholder: 'Ваше отчество',
      label: 'Отчество',
      defaultValue: '',
    },
    {
      type: 'text',
      name: 'user_create.username',
      placeholder: 'Ваш юзернейм',
      label: 'Юзернейм',
      defaultValue: '',
    },
    {
      type: 'date',
      name: 'user_create.birthdate',
      placeholder: 'Ваша дата рождения',
      label: 'Дата рождения',
      defaultValue: '',
    },
    // {
    //   type: 'select',
    //   name: 'user_create.country',
    //   placeholder: 'Выберите из списка',
    //   label: 'Страна',
    //   defaultValue: '',
    //   selectOptions: [
    //     {
    //       value: 'ru',
    //       option: 'Россия',
    //     },
    //     {
    //       value: 'kz',
    //       option: 'Казахстан',
    //     },
    //     {
    //       value: 'by',
    //       option: 'Беларусь',
    //     },
    //   ],
    // },
    {
      type: 'radio',
      name: 'user_create.gender',
      label: 'Пол',
      defaultValue: '',
      orientation: 'row',
      radioOptions: {
        true: 'Мужчина',
        false: 'Женщина',
      },
    },
  ],
};

export function RegisterStepThree({
  form,
  lang,
  switchStep,
}: TypeRegisterStepThreeProps) {
  return (
    <>
      <CustomFieldset
        form={form}
        lang={lang}
        fieldsetData={regStepThreeFieldset}
      />
      <ButtonsBlock>
        <Button
          className="w-full text-foreground sm:w-auto"
          size="lg"
          type="button"
          variant="ruchampTransparentGreyBorder"
          onClick={() => switchStep(2)}
        >
          Назад
        </Button>
        <Button
          className="w-full sm:w-auto"
          size="lg"
          type="button"
          variant="ruchampDefault"
          onClick={async () => {
            const output = await form.trigger([
              'user_create.birthdate',
              // 'user_create.country',
              'user_create.fathername',
              'user_create.gender',
              'user_create.name',
              'user_create.sirname',
              'user_create.username',
            ]);
            if (output) {
              switchStep(4);
            }
          }}
        >
          Продолжить
        </Button>
      </ButtonsBlock>
    </>
  );
}
