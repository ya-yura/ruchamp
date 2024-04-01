import {
  Button,
  Caption1,
  SelectTabData,
  SelectTabEvent,
} from '@fluentui/react-components';
import { AuthSwitcher } from '../../ui/auth/auth-switcher';
import { CustomLink } from '../../ui/custom-link';
import { CustomFieldset } from '../../ui/forms/custom-fieldset';
import { TypeCustomFieldsetProps } from '@/lib/definitions';
import { Locale } from '@/i18n.config';

type TypeRegisterStepOneProps = {
  selectedValue: 'login' | 'register';
  onTabSelect: (event: SelectTabEvent, data: SelectTabData) => void;
  lang: Locale;
  switchStep: (num: 1 | 2 | 3 | 4) => void;
  isDisabled: boolean;
  linkText: string;
  buttonText: string;
} & TypeCustomFieldsetProps;

export function RegisterStepOne({
  selectedValue,
  onTabSelect,
  isDisabled,
  fields,
  onChange,
  onBlur,
  values,
  errors,
  passwordState,
  lang,
  switchStep,
  linkText,
  buttonText,
}: TypeRegisterStepOneProps) {
  return (
    <>
      <div className="mb-6 flex w-auto items-center justify-center">
        <AuthSwitcher selectedValue={selectedValue} onTabSelect={onTabSelect} />
      </div>
      <CustomFieldset
        fields={fields}
        onChange={onChange}
        onBlur={onBlur}
        values={values}
        errors={errors}
        passwordState={passwordState}
      />
      <div className="flex items-center justify-between">
        <CustomLink
          className="transition-opacity duration-300 hover:opacity-70"
          href="/login"
          lang={lang}
        >
          <Caption1 as="p">{linkText}</Caption1>
        </CustomLink>
        <Button
          appearance="primary"
          size="large"
          type="button"
          disabled={isDisabled}
          onClick={() => switchStep(2)}
        >
          {buttonText}
        </Button>
      </div>
    </>
  );
}
