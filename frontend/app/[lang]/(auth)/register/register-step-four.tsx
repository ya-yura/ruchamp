import { Button, Spinner } from '@fluentui/react-components';
import { CustomFieldset } from '../../../../components/forms/custom-fieldset';
import {
  EnumUserRole,
  TypeAthleteFields,
  TypeCustomFieldsetProps,
  TypeFirstUserFields,
} from '@/lib/definitions';
import { MultiselectWithTags } from '../../../../components/forms/custom-multiselect';
import { CustomSelect } from '../../../../components/forms/custom-select';
import { ErrorCircle20Regular } from '@fluentui/react-icons';

type TypeRegisterStepFourProps = {
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
  errorMessage: string | undefined;
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
      {userRoleId === EnumUserRole.athlete && (
        <fieldset className="mb-6 w-[400px]">
          <MultiselectWithTags
            multiselectId={multiselectId}
            options={sportsOptions}
            label={sportsTypeSelectLabel}
            placeholder={sportsTypePlaceholder}
            setValues={setValues}
          />
        </fieldset>
      )}
      {userRoleId === EnumUserRole.referee && (
        <fieldset className="mb-6 w-[400px]">
          <CustomSelect
            label={refereeLabel}
            defaultOption={refereeDefaultOption}
            id={refereeSelectId}
            name={refereeSelectId}
            onSelect={onSelect}
            options={refereeOptions}
          />
        </fieldset>
      )}
      {errorMessage && (
        <p className="mb-3">
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
