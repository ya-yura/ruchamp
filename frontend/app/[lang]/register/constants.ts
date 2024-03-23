import { FieldProps, InputProps } from '@fluentui/react-components';

export const basicRegisterFields: Array<
  Partial<FieldProps> & Partial<InputProps>
> = [
  {
    label: 'Почта',
    type: 'email',
    placeholder: 'Введите вашу почту',
    name: 'email',
  },
  {
    label: 'Пароль',
    type: 'password',
    placeholder: 'Введите ваш пароль',
    name: 'password',
  },
  {
    label: 'Повторите пароль',
    type: 'password',
    placeholder: 'Повторите ваш пароль',
    name: 'password',
  },
];

export const otherRegisterFields: Array<
  Partial<FieldProps> & Partial<InputProps>
> = [
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

export const athleteRegisterFields: Array<
  Partial<FieldProps> & Partial<InputProps>
> = [
  {
    label: 'Вес',
    type: 'text',
    placeholder: 'Укажите ваш вес',
    name: 'athlete_weight',
  },
  {
    label: 'Рост',
    type: 'text',
    placeholder: 'Укажите ваш рост',
    name: 'athlete_height',
  },
  {
    label: 'Вид спорта',
    type: 'text',
    placeholder: 'Укажите виды спорта',
    name: 'athlete_sport_type',
  },
];

export const organizerRegisterFields: Array<
  Partial<FieldProps> & Partial<InputProps>
> = [
  {
    label: 'Название организации',
    type: 'text',
    placeholder: 'Введите название организации',
    name: 'EventOrganizer_organization_name',
  },
  {
    label: 'Сайт организации',
    type: 'text',
    placeholder: 'https://',
    name: 'EventOrganizer_organization_website',
  },
  {
    label: 'Контактный email',
    type: 'email',
    placeholder: 'Корпоративная почта',
    name: 'EventOrganizer_organization_contact_email',
  },
  {
    label: 'Контактный телефон',
    type: 'tel',
    placeholder: 'Корпоративный телефон',
    name: 'EventOrganizer_organization_contact_phone',
  },
];

export const spectatorRegisterFields: Array<
  Partial<FieldProps> & Partial<InputProps>
> = [
  {
    label: 'Ваш телефон',
    type: 'tel',
    placeholder: 'Введите номертелефона',
    name: 'spectator_phone_number',
  },
];

export const refereeRegisterFields: Array<
  Partial<FieldProps> & Partial<InputProps>
> = [
  {
    label: 'Ваш уровень квалификации',
    type: 'number',
    placeholder: 'Введите уровень квалификации',
    name: 'referee_qualification_level',
  },
];
