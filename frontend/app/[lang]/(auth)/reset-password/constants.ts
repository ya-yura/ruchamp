import { FieldProps, InputProps } from '@fluentui/react-components';

export const resetPasswordFields: Array<
  Partial<FieldProps> & Partial<InputProps>
> = [
  {
    label: 'Новый пароль',
    type: 'password',
    placeholder: 'Введите новый пароль',
    name: 'password',
  },
  {
    label: 'Введите новый пароль ещё раз',
    type: 'password',
    placeholder: 'Повторите новый пароль пароль',
    name: 'repeat_password',
  },
];
