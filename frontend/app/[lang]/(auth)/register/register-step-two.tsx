import { Locale } from '@/i18n.config';
import { UseFormReturn } from 'react-hook-form';
import { TypeRegFormSchema } from './register-form';
import {
  CustomFieldset,
  TypeFieldsetData,
} from '@/components/forms/custom-fieldset';
import { Button } from '@/components/ui/button';
import { ButtonsBlock } from '@/components/auth/buttons-block';

type TypeRegisterStepTwoProps = {
  form: UseFormReturn<TypeRegFormSchema>;
  lang: Locale;
  switchStep: (num: 1 | 2 | 3 | 4) => void;
};

const regStepTwoFieldset: TypeFieldsetData<TypeRegFormSchema> = {
  fields: [
    {
      type: 'customradio',
      name: 'user_create.role_id',
      defaultValue: '1',
      orientation: 'row',
      customRadioOptions: [
        {
          value: '1',
          option: 'Спортсмен',
          icon: '/ru/images/icons/roles/athlete.svg',
        },
        {
          value: '3',
          option: 'Зритель',
          icon: '/ru/images/icons/roles/spectator.svg',
        },
        {
          value: '2',
          option: 'Организатор',
          icon: '/ru/images/icons/roles/organizer.svg',
        },
        {
          value: '5',
          option: 'Судья',
          icon: '/ru/images/icons/roles/referee.svg',
        },
      ],
    },
  ],
};

export function RegisterStepTwo({
  form,
  lang,
  switchStep,
}: TypeRegisterStepTwoProps) {
  return (
    <>
      <CustomFieldset<TypeRegFormSchema>
        form={form}
        lang={lang}
        fieldsetData={regStepTwoFieldset}
      />
      <ButtonsBlock>
        <Button
          className="w-full text-foreground sm:w-auto"
          size="lg"
          type="button"
          variant="ruchampTransparentGreyBorder"
          onClick={() => switchStep(1)}
        >
          Назад
        </Button>
        <Button
          className="w-full sm:w-auto"
          size="lg"
          type="button"
          variant="ruchampDefault"
          onClick={async () => {
            const output = await form.trigger(['user_create.role_id']);
            if (output) {
              switchStep(3);
            }
          }}
        >
          Продолжить
        </Button>
      </ButtonsBlock>
    </>
  );
}
