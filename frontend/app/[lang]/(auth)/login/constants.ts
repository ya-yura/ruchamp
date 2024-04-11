import { FieldProps, InputProps } from '@fluentui/react-components';

export const loginFields: Array<Partial<FieldProps> & Partial<InputProps>> = [
  {
    label: 'Электронная почта',
    type: 'email',
    placeholder: 'Введите вашу почту',
    name: 'username',
  },
  {
    label: 'Пароль',
    type: 'password',
    placeholder: 'Введите ваш пароль',
    name: 'password',
  },
];
