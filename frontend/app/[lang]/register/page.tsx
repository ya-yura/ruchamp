'use client';

import {
  Button,
  Field,
  Label,
  Radio,
  RadioGroup,
  RadioGroupOnChangeData,
  Select,
  SelectOnChangeData,
  Spinner,
  Subtitle2Stronger,
  useId,
} from '@fluentui/react-components';
import { InputField } from '../ui/auth/input-field';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useDictionary } from '../dictionary-provider';
import { useRouter } from 'next/navigation';
import { useForm } from '@/lib/hooks/useForm';
import { registerFields } from './constants';
import type {
  TypeRegisterFields,
  TypeStringUserFields,
} from '@/lib/definitions';
import { ErrorCircle20Regular } from '@fluentui/react-icons';

export default function Register() {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { values, handleChange, setValues } = useForm();
  const { page, common } = useDictionary();
  const router = useRouter();
  const selectId = useId();

  const roles: Record<string, string> = {
    [common.roles[1]]: '1',
    [common.roles[2]]: '2',
    [common.roles[3]]: '3',
    [common.roles[4]]: '4',
    [common.roles[5]]: '5',
  };

  async function handleRegister(): Promise<void> {
    setIsLoading(true);
    try {
      // Take a look on this values later
      const otherValues: Partial<TypeRegisterFields> = {
        is_active: false,
        is_superuser: false,
        is_verified: false,
      };
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`,
        {
          method: 'POST',
          body: JSON.stringify({ ...values, ...otherValues }),
          headers: { 'Content-Type': 'application/json' },
        },
      );
      if (res.ok) {
        router.push('/login');
      } else {
        console.error('Failed to register:', res.statusText);
        setErrorMessage(page.register.registerError);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessage(page.register.registerError + JSON.stringify(error));
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    handleRegister();
  }

  function handleRadioChange(
    ev: FormEvent<HTMLDivElement>,
    data: RadioGroupOnChangeData,
  ): void {
    if (data.value === 'male' || data.value === 'female') {
      setValues((prevValues) => ({
        ...prevValues,
        gender: data.value === 'male' ? true : false,
      }));
    }
  }

  function handleSelectChange(
    ev: ChangeEvent<HTMLSelectElement>,
    data: SelectOnChangeData,
  ): void {
    const roleId = parseInt(data.value);
    if (!isNaN(roleId)) {
      setValues((prevValues) => ({
        ...prevValues,
        role_id: roleId,
      }));
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-112px)] flex-col items-center justify-start py-11">
      <form
        className="mt-8 flex w-2/3 max-w-[800px] flex-col justify-evenly rounded-md bg-slate-500 px-20 py-6"
        onSubmit={handleSubmit}
      >
        <fieldset
          className="relative  mb-6 grid h-auto w-full grid-cols-2 gap-x-11 gap-y-5 pb-8 pt-6"
          disabled={isLoading}
        >
          <legend className="text-center">
            <Subtitle2Stronger>{page.register.subtitle}</Subtitle2Stronger>
          </legend>
          {registerFields.map((item, index) => {
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
                    (values[name as keyof TypeStringUserFields] as string) ||
                    '',
                  name,
                }}
              />
            );
          })}
          <Field label="Пол" required size="large">
            <RadioGroup
              layout="horizontal"
              name="gender"
              onChange={handleRadioChange}
            >
              <Radio value="male" label="Мужской" />
              <Radio value="female" label="Женский" />
            </RadioGroup>
          </Field>
          <Field size="large">
            <Label htmlFor={selectId} required size="large">
              Роль
            </Label>
            <Select
              name="role_id"
              id={selectId}
              appearance="outline"
              onChange={handleSelectChange}
              defaultValue=""
            >
              <option value="" disabled>
                {page.register.chooseRole}
              </option>
              {Object.entries(roles).map(([key, value]) => (
                <option key={value} value={value}>
                  {key}
                </option>
              ))}
            </Select>
          </Field>
          {errorMessage && (
            <p className="absolute bottom-0 left-[25%]">
              <ErrorCircle20Regular
                aria-label={errorMessage}
                primaryFill="rgb(248 113 113)"
              />{' '}
              <span className="text-red-400">{errorMessage}</span>
            </p>
          )}
        </fieldset>
        <div className="ml-auto mr-auto">
          <Button
            appearance="primary"
            size="large"
            type="submit"
            disabled={isLoading}
          >
            {isLoading && <Spinner size="tiny" label="" />}{' '}
            {page.register.register}
          </Button>
        </div>
      </form>
    </main>
  );
}
