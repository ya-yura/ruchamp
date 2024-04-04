import {
  Button,
  Field,
  Radio,
  RadioGroup,
  RadioGroupOnChangeData,
} from '@fluentui/react-components';
import { CustomFieldset } from '../../ui/forms/custom-fieldset';
import {
  TypeCustomFieldsetProps,
  TypeFirstUserFields,
} from '@/lib/definitions';
import { Locale } from '@/i18n.config';
import { FormEvent, useEffect } from 'react';
import { CustomSelect } from '../../ui/forms/custom-select';

type TypeRegisterStepThreeProps = {
  lang: Locale;
  switchStep: (num: 1 | 2 | 3 | 4) => void;
  onRadioChange: (
    ev: FormEvent<HTMLDivElement>,
    data: RadioGroupOnChangeData,
  ) => void;
  isDisabled: boolean;
  genderSelectId: keyof TypeFirstUserFields;
  buttonText: string;
} & TypeCustomFieldsetProps;

export function RegisterStepThree({
  isDisabled,
  fields,
  onChange,
  onRadioChange,
  values,
  lang,
  switchStep,
  genderSelectId,
  buttonText,
}: TypeRegisterStepThreeProps) {
  return (
    <>
      <CustomFieldset fields={fields} onChange={onChange} values={values} />
      <fieldset className="flex w-[400px] flex-col gap-4">
        <CustomSelect
          label={'Страна'}
          defaultOption={'Выберите вашу страну'}
          id={'country'}
          name={'country'}
          onSelect={() => console.log('123')}
          options={{ Россиия: 'Россия', Беларусь: 'Беларусь' }}
        />
        <Field label="Пол" required>
          <RadioGroup
            layout="horizontal"
            onChange={onRadioChange}
            name={genderSelectId}
          >
            <Radio value="male" label="Мужчина" />
            <Radio value="female" label="Женщина" />
          </RadioGroup>
        </Field>
      </fieldset>
      <div className="flex items-center justify-end">
        <Button
          appearance="primary"
          size="large"
          type="button"
          disabled={isDisabled}
          onClick={() => switchStep(4)}
        >
          {buttonText}
        </Button>
      </div>
    </>
  );
}
