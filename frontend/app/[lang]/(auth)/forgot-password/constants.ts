import { FieldProps, InputProps } from '@fluentui/react-components';

export const forgotPasswordFields: Array<
  Partial<FieldProps> & Partial<InputProps>
> = [
  {
    label: 'Электронная почта',
    type: 'email',
    placeholder: 'Введите вашу почту',
    name: 'username',
  },
];
