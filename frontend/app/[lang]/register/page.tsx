'use client';

import {
  Button,
  Field,
  FieldProps,
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
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useDictionary } from '../dictionary-provider';
import { useRouter } from 'next/navigation';
import { useForm } from '@/lib/hooks/useForm';
import {
  athleteRegisterFields,
  basicRegisterFields,
  organizerRegisterFields,
  otherRegisterFields,
  refereeRegisterFields,
  spectatorRegisterFields,
} from './constants';
import type {
  TypeRegisterFields,
  TypeStringUserFields,
} from '@/lib/definitions';
import { ErrorCircle20Regular } from '@fluentui/react-icons';
import { UserFieldset } from '../ui/forms/user-fieldset';
import { useUserStore } from '@/lib/store/user';
import { auth } from '@/lib/client-api/auth';
import { comparePasswords } from '@/lib/utils';

export default function Register() {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [passwordState, setPasswordState] = useState<{
    state: FieldProps['validationState'];
    message: string;
  }>({
    state: 'none',
    message: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [step, setStep] = useState<1 | 2>(1);
  const { values, touched, handleChange, setValues } = useForm();
  const { page, common } = useDictionary();
  const router = useRouter();
  const selectId = useId();

  const roles: Record<string, string> = {
    [common.roles[1]]: '1',
    [common.roles[2]]: '2',
    [common.roles[3]]: '3',
    // [common.roles[4]]: '4',
    [common.roles[5]]: '5',
  };

  useEffect(() => {
    setValues({
      role_id: 1,
    });
  }, []);

  function handleRegister(values: Partial<TypeRegisterFields>): void {
    setIsLoading(true);
    auth
      .register(values)
      .then(() => router.push('/login'))
      .catch((err) => {
        setErrorMessage(page.register.registerError);
      })
      .finally(() => setIsLoading(false));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    handleRegister(values);
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
        <fieldset className="" disabled={step === 2}>
          <InputField
            fieldProps={{
              label: 'Почта',
            }}
            inputProps={{
              name: 'email',
              type: 'email',
              placeholder: 'Введите почту',
              onChange: handleChange,
              value: (values['email'] as TypeRegisterFields['password']) || '',
            }}
          />
          <InputField
            fieldProps={{
              label: 'Пароль',
              validationState: passwordState.state,
              validationMessage: passwordState.message,
            }}
            inputProps={{
              name: 'password',
              type: 'password',
              placeholder: 'Введите пароль',
              onChange: handleChange,
              onBlur: (e: React.FocusEvent<HTMLInputElement>) =>
                comparePasswords(values, touched, setPasswordState),
              value:
                (values['password'] as TypeRegisterFields['password']) || '',
            }}
          />
          <InputField
            fieldProps={{
              label: 'Повторите пароль',
              validationState: passwordState.state,
              validationMessage: passwordState.message,
            }}
            inputProps={{
              name: 'repeatPassword',
              type: 'password',
              placeholder: 'Повторите пароль',
              onChange: handleChange,
              onBlur: (e: React.FocusEvent<HTMLInputElement>) =>
                comparePasswords(values, touched, setPasswordState),
              value:
                (values['repeatPassword'] as TypeRegisterFields['password']) ||
                '',
            }}
          />
        </fieldset>
        <fieldset>
          {step === 1 ? (
            <div className="ml-auto mr-auto flex justify-center">
              <Button
                appearance="primary"
                size="large"
                onClick={() => setStep(2)}
                disabled={!(values.email && passwordState.state === 'success')} // add more checks
              >
                Выбрать роль
              </Button>
            </div>
          ) : (
            <Field size="large">
              <Label htmlFor={selectId} required size="large">
                Роль
              </Label>
              <Select
                name="role_id"
                id={selectId}
                appearance="outline"
                onChange={handleSelectChange}
                defaultValue="1"
              >
                {/* <option value="" disabled>
                  {page.register.chooseRole}
                </option> */}
                {Object.entries(roles).map(([key, value]) => (
                  <option key={value} value={value}>
                    {key}
                  </option>
                ))}
              </Select>
            </Field>
          )}
        </fieldset>
        {step === 2 && (
          <>
            <fieldset>
              <UserFieldset
                isDisabled={isLoading}
                subtitle={page.register.subtitle}
                fields={otherRegisterFields}
                handleChange={handleChange}
                handleRadioChange={handleRadioChange}
                handleSelectChange={handleSelectChange}
                values={values}
                chooseOption={page.register.chooseRole}
                roles={roles}
                errorMessage={errorMessage}
              />
            </fieldset>
            <fieldset>
              {values.role_id === 1 && (
                <UserFieldset
                  isDisabled={isLoading}
                  subtitle={''}
                  fields={athleteRegisterFields}
                  handleChange={handleChange}
                  handleRadioChange={handleRadioChange}
                  handleSelectChange={handleSelectChange}
                  values={values}
                  chooseOption={page.register.chooseRole}
                  roles={roles}
                  errorMessage={errorMessage}
                />
              )}
              {values.role_id === 2 && (
                <UserFieldset
                  isDisabled={isLoading}
                  subtitle={''}
                  fields={organizerRegisterFields}
                  handleChange={handleChange}
                  handleRadioChange={handleRadioChange}
                  handleSelectChange={handleSelectChange}
                  values={values}
                  chooseOption={page.register.chooseRole}
                  roles={roles}
                  errorMessage={errorMessage}
                />
              )}
              {values.role_id === 3 && (
                <UserFieldset
                  isDisabled={isLoading}
                  subtitle={''}
                  fields={spectatorRegisterFields}
                  handleChange={handleChange}
                  handleRadioChange={handleRadioChange}
                  handleSelectChange={handleSelectChange}
                  values={values}
                  chooseOption={page.register.chooseRole}
                  roles={roles}
                  errorMessage={errorMessage}
                />
              )}
              {values.role_id === 5 && (
                <UserFieldset
                  isDisabled={isLoading}
                  subtitle={''}
                  fields={refereeRegisterFields}
                  handleChange={handleChange}
                  handleRadioChange={handleRadioChange}
                  handleSelectChange={handleSelectChange}
                  values={values}
                  chooseOption={page.register.chooseRole}
                  roles={roles}
                  errorMessage={errorMessage}
                />
              )}
            </fieldset>
          </>
        )}

        {/* <UserFieldset
          isDisabled={isLoading}
          subtitle={page.register.subtitle}
          fields={registerFields}
          handleChange={handleChange}
          handleRadioChange={handleRadioChange}
          handleSelectChange={handleSelectChange}
          values={values}
          chooseOption={page.register.chooseRole}
          roles={roles}
          errorMessage={errorMessage}
        /> */}
        {/* <fieldset
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
        </fieldset> */}
        {step === 2 && (
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
        )}
      </form>
    </main>
  );
}
