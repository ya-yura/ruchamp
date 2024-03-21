'use client';

import { useUserStore } from '@/lib/store/user';
import {
  Button,
  Field,
  Radio,
  RadioGroup,
  Subtitle2Stronger,
} from '@fluentui/react-components';
import { useEffect, useState } from 'react';
import { InputField } from '../ui/auth/input-field';
import { useDictionary } from '../dictionary-provider';
import { useForm } from '@/lib/hooks/useForm';
import { TypeUser } from '@/lib/definitions';
import { profileFields } from './constants';

export default function Profile() {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const user = useUserStore((store) => store.user);
  const { page } = useDictionary();
  const { values, handleChange, setValues } = useForm();

  useEffect(() => {
    useUserStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (user) {
      setValues({
        email: user.email,
        username: user.username,
        name: user.name,
        sirname: user.sirname,
        fathername: user.fathername,
        country: user.country,
        birthdate: user.birthdate,
      });
    }
  }, [user]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    console.log('submit');
  }

  function switchMode() {
    setIsEditMode(!isEditMode);
    if (user) {
      setValues({
        email: user.email,
        username: user.username,
        name: user.name,
        sirname: user.sirname,
        fathername: user.fathername,
        country: user.country,
        birthdate: user.birthdate,
      });
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-112px)] flex-col items-center justify-start py-11">
      <form
        className="mt-8 flex w-2/3 max-w-[800px] flex-col justify-evenly rounded-md bg-slate-500 px-20 py-6"
        onSubmit={handleSubmit}
      >
        <fieldset
          className="relative mb-6 grid h-auto w-full grid-cols-2 gap-x-11 gap-y-5 pb-8 pt-6"
          disabled={!isEditMode}
        >
          <legend className="text-center">
            <Subtitle2Stronger>{page.profile.subtitle}</Subtitle2Stronger>
          </legend>
          {profileFields.map((item, index) => {
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
                  value: (values[name as keyof TypeUser] as string) || '',
                  name,
                  appearance: 'underline',
                }}
              />
            );
          })}
          <Field label="Пол" required size="large">
            <RadioGroup
              layout="horizontal"
              defaultValue={user?.gender ? 'male' : 'female'} // тут нужно разобраться
            >
              <Radio value="male" label="Мужской" />
              <Radio value="female" label="Женский" />
            </RadioGroup>
          </Field>
        </fieldset>
        <div className="ml-auto mr-auto">
          {isEditMode ? (
            <div className="flex gap-4">
              <Button
                appearance="secondary"
                size="large"
                type="button"
                onClick={switchMode}
                // disabled={isLoading}
              >
                {/* {isLoading && <Spinner size="tiny" label="" />}{' '} */}
                {page.profile.cancel}
              </Button>
              <Button
                appearance="primary"
                size="large"
                type="submit"
                // disabled={isLoading}
              >
                {/* {isLoading && <Spinner size="tiny" label="" />}{' '} */}
                {page.profile.save}
              </Button>
            </div>
          ) : (
            <Button
              appearance="primary"
              size="large"
              type="button"
              onClick={switchMode}
              // disabled={isLoading}
            >
              {/* {isLoading && <Spinner size="tiny" label="" />}{' '} */}
              {page.profile.edit}
            </Button>
          )}
        </div>
      </form>
    </main>
  );
}
