import { Button, Spinner } from '@fluentui/react-components';
import { CustomFieldset } from '../../ui/forms/custom-fieldset';
import {
  EnumUserRole,
  TypeAthleteFields,
  TypeCustomFieldsetProps,
  TypeFirstUserFields,
} from '@/lib/definitions';
import { Locale } from '@/i18n.config';
import { MultiselectWithTags } from '../../ui/forms/custom-multiselect';
import { CustomSelect } from '../../ui/forms/custom-select';
import { ErrorCircle20Regular } from '@fluentui/react-icons';

type TypeRegisterStepFourProps = {
  lang: Locale;
  userRoleId: TypeFirstUserFields['role_id'];
  refereeSelectId: string;
  multiselectId: keyof TypeAthleteFields;
  refereeOptions: { [key: string]: string };
  refereeLabel: string;
  refereeDefaultOption: string;
  sportsTypeSelectLabel: string;
  sportsTypePlaceholder: string;
  sportsOptions: string[];
  buttonText: string;
  errorMessage: string;
  isDisabled: boolean;
} & TypeCustomFieldsetProps;

export function RegisterStepFour({
  isLoading,
  fields,
  onChange,
  onSelect,
  values,
  errors,
  setValues,
  userRoleId,
  multiselectId,
  lang,
  refereeSelectId,
  refereeOptions,
  refereeLabel,
  refereeDefaultOption,
  sportsTypeSelectLabel,
  sportsTypePlaceholder,
  sportsOptions,
  buttonText,
  errorMessage,
  isDisabled,
}: TypeRegisterStepFourProps) {
  return (
    <>
      {(userRoleId === EnumUserRole.athlete ||
        userRoleId === EnumUserRole.organizer ||
        userRoleId === EnumUserRole.spectator) && (
        <CustomFieldset
          isLoading={isLoading}
          fields={fields}
          onChange={onChange}
          values={values}
          errors={errors}
        />
      )}
      <fieldset className="mb-6 w-[400px]">
        {userRoleId === EnumUserRole.athlete && (
          <MultiselectWithTags
            multiselectId={multiselectId}
            options={sportsOptions}
            label={sportsTypeSelectLabel}
            placeholder={sportsTypePlaceholder}
            setValues={setValues}
          />
        )}
        {userRoleId === EnumUserRole.referee && (
          <CustomSelect
            label={refereeLabel}
            defaultOption={refereeDefaultOption}
            id={refereeSelectId}
            name={refereeSelectId}
            onSelect={onSelect}
            options={refereeOptions}
          />
        )}
      </fieldset>
      {errorMessage && (
        <p className="">
          <ErrorCircle20Regular
            aria-label={errorMessage}
            primaryFill="rgb(248 113 113)"
          />{' '}
          <span className="text-red-400">{errorMessage}</span>
        </p>
      )}
      <div className="flex items-center justify-end">
        <Button
          appearance="primary"
          size="large"
          type="submit"
          disabled={isLoading || isDisabled}
        >
          {isLoading && <Spinner size="tiny" label="" />} {buttonText}
        </Button>
      </div>
    </>
  );
}
