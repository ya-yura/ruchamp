'use client';

import {
  FieldProps,
  SelectTabData,
  SelectTabEvent,
} from '@fluentui/react-components';
import { useEffect, useState } from 'react';
import {
  basicRegisterFields,
  otherRegisterFields,
  refereeLevels,
  specialRegisterFields,
  switchTitle,
  userRoles,
} from './constants';
import { useRouter } from 'next/navigation';
import { useForm } from '@/lib/hooks/useForm';
import { Greetings } from '../../ui/greetings';
import { Locale } from '@/i18n.config';
import { CustomForm } from '../../ui/forms/custom-form';
import { RegisterStepOne } from './register-step-one';
import { RegisterStepTwo } from './register-step-two';
import { RegisterStepThree } from './register-step-three';
import { RegisterStepFour } from './register-step-four';
import {
  TypeAthleteFields,
  TypeFirstUserFields,
  TypeLoginFields,
  TypeRegisterFields,
  TypeUserRole,
} from '@/lib/definitions';
import { auth } from '@/lib/api/auth';
import { comparePasswords } from '@/lib/utils';
import { sportsTypes } from '@/lib/constants';

export function RegisterForm({ lang }: { lang: Locale }) {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const {
    values,
    errors,
    touched,
    setValues,
    handleChange,
    handleRadioChange,
    handleSelectChange,
  } = useForm();
  const router = useRouter();
  const [selectedValue, setSelectedValue] = useState<'login' | 'register'>(
    'register',
  );
  const [greetings, setGreetings] = useState<{
    title: string;
    subtitle: string;
  }>({ title: 'Привет!', subtitle: 'Это страница регистрации.' });
  const [passwordState, setPasswordState] = useState<{
    state: FieldProps['validationState'];
    message: string;
  }>({
    state: 'none',
    message: '',
  });

  useEffect(() => {
    if (selectedValue === 'login') {
      router.push(`/${lang}/login`);
    } else {
      router.push(`/${lang}/register`);
    }
  }, [selectedValue]);

  useEffect(() => {
    switchTitle(step, setGreetings);
  }, [step]);

  async function handleRegister(): Promise<void> {
    setIsLoading(true);
    setErrorMessage('');
    auth
      .register(values)
      .then(() => {
        // auth
        //   .login(
        //     values.email as keyof TypeLoginFields,
        //     values.password as keyof TypeLoginFields,
        //   )
        router.push('/ru/login');
      })
      .catch((err) => {
        console.log('Register error:', err);
        setErrorMessage('Произошла ошибка регистрации');
      })
      .finally(() => setIsLoading(false));
  }

  function onTabSelect(event: SelectTabEvent, data: SelectTabData) {
    setSelectedValue(data.value as 'login' | 'register');
  }

  function switchStep(step: 1 | 2 | 3 | 4) {
    setStep(step);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    handleRegister();
  }

  return (
    <>
      <Greetings title={greetings.title} subtitle={greetings.subtitle} />
      <CustomForm onSubmit={handleSubmit}>
        {step === 1 && (
          <RegisterStepOne
            selectedValue={selectedValue}
            onTabSelect={onTabSelect}
            fields={basicRegisterFields}
            onChange={handleChange}
            onBlur={() => comparePasswords(values, touched, setPasswordState)}
            values={values}
            errors={errors}
            lang={lang}
            switchStep={switchStep}
            linkText={'Я уже зарегистрирован'}
            buttonText={'Выбрать роль'}
            passwordState={passwordState}
            isDisabled={
              !(values.email && values.password && values.repeat_password) ||
              passwordState.state !== 'success' ||
              !!(errors.email || errors.password)
            }
          />
        )}
        {step === 2 && (
          <RegisterStepTwo
            lang={lang}
            label={'Ваша роль:'}
            switchStep={switchStep}
            onRadioChange={handleRadioChange}
            roleSelectId={'role_id' as keyof TypeFirstUserFields}
            userRoles={userRoles}
            buttonText={'Продолжить'}
            isDisabled={!values.role_id}
          />
        )}
        {step === 3 && (
          <RegisterStepThree
            fields={otherRegisterFields}
            onChange={handleChange}
            onRadioChange={handleRadioChange}
            onSelect={handleSelectChange}
            values={values}
            lang={lang}
            switchStep={switchStep}
            genderSelectId={'gender' as keyof TypeFirstUserFields}
            buttonText={'Продолжить'}
            countrySelectLabel={'Страна'}
            defaultCountrySelectLabel={'Выберите вашу страну'}
            idCoutrySelect={'country'}
            isDisabled={
              !(
                values.name &&
                values.sirname &&
                values.fathername &&
                values.username &&
                (values.gender === true || values.gender === false) &&
                values.country &&
                values.birthdate
              )
            }
          />
        )}
        {step === 4 && (
          <RegisterStepFour
            isLoading={isLoading}
            fields={specialRegisterFields(values.role_id as TypeUserRole)}
            onChange={handleChange}
            onSelect={handleSelectChange}
            values={values as TypeRegisterFields}
            errors={errors}
            setValues={setValues}
            userRoleId={values.role_id}
            multiselectId={'athlete_sport_type' as keyof TypeAthleteFields}
            errorMessage={errorMessage}
            refereeSelectId={'referee_qualification_level'}
            refereeOptions={refereeLevels}
            refereeLabel={'Укажите свою категорию'}
            refereeDefaultOption={'Выберите один вариант из списка'}
            sportsTypeSelectLabel={'Выберите виды спорта'}
            sportsTypePlaceholder={'Выберите один или несколько видов'}
            sportsOptions={sportsTypes}
            buttonText={'Зарегистрироваться'}
            isDisabled={false} // add logic
          />
        )}
      </CustomForm>
    </>
  );
}
