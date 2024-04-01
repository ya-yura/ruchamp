import {
  Button,
  Field,
  Radio,
  RadioGroup,
  RadioGroupOnChangeData,
} from '@fluentui/react-components';
import { Locale } from '@/i18n.config';
import { FormEvent } from 'react';
import { TypeFirstUserFields } from '@/lib/definitions';

type TypeRegisterStepTwoProps = {
  lang: Locale;
  label: string;
  switchStep: (num: 1 | 2 | 3 | 4) => void;
  onRadioChange: (
    ev: FormEvent<HTMLDivElement>,
    data: RadioGroupOnChangeData,
  ) => void;
  isDisabled: boolean;
  roleSelectId: keyof TypeFirstUserFields;
  userRoles: { [key: string]: string };
  buttonText: string;
};

export function RegisterStepTwo({
  lang,
  label,
  switchStep,
  onRadioChange,
  isDisabled,
  roleSelectId,
  userRoles,
  buttonText,
}: TypeRegisterStepTwoProps) {

  return (
    <>
      <fieldset className="w-[400px]">
        <Field label={label} size="large" required>
          <RadioGroup
            onChange={onRadioChange}
            name={roleSelectId}
            id={roleSelectId}
            as="div"
          >
            {Object.entries(userRoles).map(([key, value]) => (
              <Radio key={key} value={key} label={value} as="input" />
            ))}
          </RadioGroup>
        </Field>
      </fieldset>

      <div className="flex items-center justify-end">
        <Button
          appearance="primary"
          size="large"
          type="button"
          disabled={isDisabled}
          onClick={() => switchStep(3)}
        >
          {buttonText}
        </Button>
      </div>
    </>
  );
}
