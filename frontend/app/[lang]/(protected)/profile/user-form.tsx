'use client';

import React, { useEffect } from 'react';
import { InputField } from '../../ui/auth/input-field';
import { EnumUserRole, TypeUser } from '@/lib/definitions';
import { CustomForm } from '../../ui/forms/custom-form';
import { Button, Field, Radio, RadioGroup } from '@fluentui/react-components';
import { useForm } from '@/lib/hooks/useForm';

export function UserForm({ user }: { user: TypeUser }) {
  const { values, setValues, handleChange } = useForm();

  useEffect(() => {
    const { name, fathername, sirname, username, email, country } = user;
    if (user) {
      setValues((prevValues) => ({
        ...prevValues,
        ...{ name, fathername, sirname, username, email, country },
      }));
    }
  }, [setValues, user]);

  function handleSubmit() {
    console.log('submit', values);
  }

  const role = () => {
    switch (user?.role_id) {
      case EnumUserRole['athlete']:
        return 'Спортсмен';
      case EnumUserRole['organizer']:
        return 'Организатор';
      case EnumUserRole['spectator']:
        return 'Зритель';
      case EnumUserRole['admin']:
        return 'Администратор';
      case EnumUserRole['referee']:
        return 'Судья';
    }
  };

  return (
    <CustomForm className="bg-gray-500" onSubmit={handleSubmit}>
      <fieldset className="flex w-[600px] flex-col gap-3">
        <InputField
          fieldProps={{
            label: 'Имя',
            orientation: 'horizontal',
          }}
          inputProps={{
            type: 'text',
            name: 'name',
            placeholder: 'Ваше имя',
            onChange: handleChange,
            value: values.name || '',
          }}
        />
        <InputField
          fieldProps={{
            label: 'Отчество',
            orientation: 'horizontal',
          }}
          inputProps={{
            type: 'text',
            name: 'fathername',
            placeholder: 'Ваше отчество',
            onChange: handleChange,
            value: values.fathername || '',
          }}
        />
        <InputField
          fieldProps={{
            label: 'Фамилия',
            orientation: 'horizontal',
          }}
          inputProps={{
            type: 'text',
            name: 'sirname',
            placeholder: 'Ваша фамилия',
            onChange: handleChange,
            value: values.sirname || '',
          }}
        />
        <InputField
          fieldProps={{
            label: 'Юзернейм',
            orientation: 'horizontal',
          }}
          inputProps={{
            type: 'text',
            name: 'username',
            placeholder: 'Ваш юзернейм',
            onChange: handleChange,
            value: values.username || '',
          }}
        />
        <InputField
          fieldProps={{
            label: 'Электронная почта',
            orientation: 'horizontal',
          }}
          inputProps={{
            type: 'text',
            name: 'email',
            placeholder: 'Ваша почта',
            onChange: handleChange,
            value: values.email || '',
          }}
        />
        <InputField
          fieldProps={{
            label: 'Страна',
            orientation: 'horizontal',
          }}
          inputProps={{
            type: 'text',
            name: 'country',
            placeholder: 'Ваша страна',
            onChange: handleChange,
            value: values.country || '',
          }}
        />
        <InputField
          fieldProps={{
            label: 'День рождения',
            orientation: 'horizontal',
          }}
          inputProps={{
            type: 'date',
            name: 'birthdate',
            value: user?.birthdate || '',
          }}
        />
        <InputField
          fieldProps={{
            label: 'Роль',
            orientation: 'horizontal',
          }}
          inputProps={{
            type: 'text',
            placeholder: 'Ваша роль',
            onChange: handleChange,
            value: role() || '',
          }}
        />
        <Field label="Пол" orientation="horizontal" required>
          <RadioGroup
            onChange={() => {}}
            name={'gender'}
            id={'gender'}
            as="div"
            defaultValue={user.gender ? 'male' : 'female'}
            layout="horizontal"
            disabled
          >
            <Radio value="male" label="Мужчина" as="input" />
            <Radio value="female" label="Женщина" as="input" />
          </RadioGroup>
        </Field>
      </fieldset>
      <div>
        <Button size='large'>Редактировать</Button>
      </div>
    </CustomForm>
  );
}
