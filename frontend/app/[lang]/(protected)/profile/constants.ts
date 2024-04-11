import { FieldProps, InputProps } from '@fluentui/react-components';

export const profileFields: Array<Partial<FieldProps> & Partial<InputProps>> = [
  {
    label: 'Почта',
    type: 'email',
    placeholder: 'Введите вашу почту',
    name: 'email',
  },
  {
    label: 'Юзернейм',
    type: 'text',
    placeholder: 'Введите ваш юзернейм',
    name: 'username',
  },
  {
    label: 'Имя',
    type: 'text',
    placeholder: 'Введите ваше имя',
    name: 'name',
  },
  {
    label: 'Фамилия',
    type: 'text',
    placeholder: 'Введите вашу фамилию',
    name: 'sirname',
  },
  {
    label: 'Отчество',
    type: 'text',
    placeholder: 'Введите ваше отчество',
    name: 'fathername',
  },
  {
    label: 'Страна',
    type: 'text',
    placeholder: 'Из какой вы страны',
    name: 'country',
  },
  {
    label: 'Дата рождения',
    type: 'date',
    placeholder: 'Из какой вы страны',
    name: 'birthdate',
  },
];
