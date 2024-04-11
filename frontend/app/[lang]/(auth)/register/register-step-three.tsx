import { Button, Field, Radio, RadioGroup } from '@fluentui/react-components';
import { CustomFieldset } from '../../ui/forms/custom-fieldset';
import {
  EnumCountries,
  TypeCustomFieldsetProps,
  TypeFirstUserFields,
} from '@/lib/definitions';
import { Locale } from '@/i18n.config';
import { CustomSelect } from '../../ui/forms/custom-select';

type TypeRegisterStepThreeProps = {
  lang: Locale;
  switchStep: (num: 1 | 2 | 3 | 4) => void;
  isDisabled: boolean;
  genderSelectId: keyof TypeFirstUserFields;
  buttonText: string;
  countrySelectLabel: string;
  defaultCountrySelectLabel: string;
  idCoutrySelect: string;
} & TypeCustomFieldsetProps;

export function RegisterStepThree({
  isDisabled,
  fields,
  onChange,
  onSelect,
  onRadioChange,
  values,
  switchStep,
  genderSelectId,
  buttonText,
  countrySelectLabel,
  defaultCountrySelectLabel,
  idCoutrySelect,
}: TypeRegisterStepThreeProps) {
  return (
    <>
      <CustomFieldset fields={fields} onChange={onChange} values={values} />
      <fieldset className="flex w-[400px] flex-col gap-4">
        <CustomSelect
          label={countrySelectLabel}
          defaultOption={defaultCountrySelectLabel}
          id={idCoutrySelect}
          onSelect={onSelect}
          options={EnumCountries}
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
