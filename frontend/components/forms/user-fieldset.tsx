'use client';

// ------------------------!!!!!!
import {
  Field,
  FieldProps,
  InputProps,
  Label,
  Radio,
  RadioGroup,
  RadioGroupOnChangeData,
  Select,
  SelectOnChangeData,
  Subtitle2Stronger,
  useId,
} from '@fluentui/react-components';
import { InputField } from '../auth/input-field';
import { TypeRegisterFields, TypeUser } from '@/lib/definitions';
import { ErrorCircle20Regular } from '@fluentui/react-icons';
import { ChangeEvent, FormEvent } from 'react';

export function UserFieldset({
  user,
  isDisabled,
  subtitle,
  fields,
  handleChange,
  handleRadioChange,
  handleSelectChange,
  values,
  chooseOption,
  roles,
  errorMessage,
  otherInputProps,
}: {
  user?: TypeUser | null;
  isDisabled: boolean;
  subtitle: string;
  fields: Array<Partial<FieldProps> & Partial<InputProps>>;
  handleChange(e: React.ChangeEvent<HTMLInputElement>): void;
  handleRadioChange(
    ev: FormEvent<HTMLDivElement>,
    data: RadioGroupOnChangeData,
  ): void;
  handleSelectChange(
    ev: ChangeEvent<HTMLSelectElement>,
    data: SelectOnChangeData,
  ): void;
  values: { [key: string]: string | number | Date | boolean };
  chooseOption: string;
  roles: Record<string, string>;
  errorMessage: string;
  otherInputProps?: InputProps;
}) {
  const selectId = useId();

  return (
    <fieldset
      className="relative  mb-6 grid h-auto w-full grid-cols-2 gap-x-11 gap-y-5 pb-8 pt-6"
      disabled={isDisabled}
    >
      <legend className="text-center">
        <Subtitle2Stronger>{subtitle}</Subtitle2Stronger>
      </legend>
      {fields.map((item, index) => {
        const { label, type, placeholder, name } = item;
        return (
          <InputField
            key={index}
            fieldProps={{
              label,
            }}
            inputProps={{
              type,
              placeholder,
              onChange: handleChange,
              value:
                (values[name as keyof TypeRegisterFields] as string) || '',
              name,
              ...otherInputProps,
            }}
          />
        );
      })}
      <Field label="Пол" required size="large">
        <RadioGroup
          layout="horizontal"
          name="gender"
          onChange={handleRadioChange}
          // value={
          //   (values['gender' as keyof TypeStringUserFields] as string) || ''
          // }
        >
          <Radio value="male" label="Мужской" />
          <Radio value="female" label="Женский" />
        </RadioGroup>
      </Field>
      {/* <Field size="large">
        <Label htmlFor={selectId} required size="large">
          Роль
        </Label>
        <Select
          name="role_id"
          id={selectId}
          appearance="outline"
          onChange={handleSelectChange}
          value={
            (values['role_id' as keyof TypeStringUserFields] as string) || ''
          }
        >
          {Object.entries(roles).map(([key, value]) => (
            <option key={value} value={value}>
              {key}
            </option>
          ))}
        </Select>
      </Field> */}
      {/* {errorMessage && (
        <p className="absolute bottom-0 left-[25%]">
          <ErrorCircle20Regular
            aria-label={errorMessage}
            primaryFill="rgb(248 113 113)"
          />{' '}
          <span className="text-red-400">{errorMessage}</span>
        </p>
      )} */}
    </fieldset>
  );
}
