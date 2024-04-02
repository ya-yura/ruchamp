import React from 'react';
import { InputField } from '../../ui/auth/input-field';
import { TypeUser } from '@/lib/definitions';

export function UserForm({ user }: { user: TypeUser }) {
  return (
    <form className="relative my-auto flex h-fit w-auto flex-col justify-evenly rounded-md bg-gray-600 px-9 py-7">
      <InputField
        fieldProps={{
          label: 'Имя',
        }}
        inputProps={{
          type: 'text',
          value: user?.name || '',
        }}
      />
      <InputField
        fieldProps={{
          label: 'Отчество',
        }}
        inputProps={{
          type: 'text',
          value: user?.fathername || '',
        }}
      />
      <InputField
        fieldProps={{
          label: 'Фамилия',
        }}
        inputProps={{
          type: 'text',
          value: user?.sirname || '',
        }}
      />
    </form>
  );
}
