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
    placeholder: 'День рождения',
    name: 'birthdate',
  },
];

type TypeField = {
  label: string;
  type: React.HTMLInputTypeAttribute;
  placeholder: string;
  name: string;
};

const fields: TypeField[] = [
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
    label: 'Юзернейм',
    type: 'text',
    placeholder: 'Введите ваш юзернейм',
    name: 'username',
  },
  {
    label: 'Почта',
    type: 'text',
    placeholder: 'Введите вашу почту',
    name: 'email',
  },
  {
    label: 'Дата рождения',
    type: 'date',
    placeholder: 'День рождения',
    name: 'birthdate',
  },
  // {
  //   label: 'Страна',
  //   type: 'text',
  //   placeholder: 'Из какой вы страны',
  //   name: 'country',
  // },
  // {
  //   label: 'Роль',
  //   type: 'number',
  //   placeholder: 'Из какой вы страны',
  //   name: 'role_id',
  // },
  // {
  //   label: 'Пол',
  //   type: 'checkbox',
  //   placeholder: 'Из какой вы страны',
  //   name: 'gender',
  // },
];