import {
  TypeAthleteFields,
  TypeBasicUserFields,
  TypeFirstUserFields,
  TypeOrganizerFields,
  TypeRefereeFields,
  TypeSpectatorFields,
  TypeUserRole,
} from '@/lib/definitions';
import { FieldProps, InputProps } from '@fluentui/react-components';
import { Dispatch, SetStateAction } from 'react';

export type TypeCountries = {
  ru: string;
  by: string;
  kz: string;
};

export const basicRegisterFields: Array<
  Partial<FieldProps> &
    Partial<InputProps> & { name: keyof TypeFirstUserFields }
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
    name: 'repeat_password',
  },
];

export const otherRegisterFields: Array<
  Partial<FieldProps> &
    Partial<InputProps> & { name: keyof TypeBasicUserFields }
> = [
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
    label: 'Дата рождения',
    type: 'date',
    placeholder: 'Из какой вы страны',
    name: 'birthdate',
  },
];

export const specialRegisterFields = (
  userRole: TypeUserRole,
): Array<
  Partial<FieldProps> &
    Partial<InputProps> & {
      name:
        | keyof TypeSpectatorFields
        | keyof TypeAthleteFields
        | keyof TypeOrganizerFields
        | keyof TypeRefereeFields;
    }
> => {
  switch (userRole) {
    case 1:
      return [
        {
          label: 'Вес',
          type: 'number',
          placeholder: 'Укажите ваш вес',
          name: 'athlete_weight',
        },
        {
          label: 'Рост',
          type: 'number',
          placeholder: 'Укажите ваш рост',
          name: 'athlete_height',
        },
      ];
    case 2:
      return [
        {
          label: 'Название организации',
          type: 'text',
          placeholder: 'Введите название организации',
          name: 'event_organizer_organization_name',
        },
        {
          label: 'Сайт организации',
          type: 'text',
          placeholder: 'https://',
          name: 'event_organizer_organization_website',
        },
        {
          label: 'Контактный email',
          type: 'email',
          placeholder: 'Корпоративная почта',
          name: 'event_organizer_organization_contact_email',
        },
        {
          label: 'Контактный телефон',
          type: 'tel',
          placeholder: 'Корпоративный телефон',
          name: 'event_organizer_organization_contact_phone',
        },
      ];
    case 3:
      return [
        {
          label: 'Ваш телефон',
          type: 'tel',
          placeholder: 'Введите номертелефона',
          name: 'spectator_phone_number',
        },
      ];
    default:
      return [];
  }
};

export const userRoles = {
  '1': 'Спортсмен',
  '2': 'Организатор',
  '3': 'Зритель',
  '5': 'Судья',
};

export const refereeLevels = {
  '1': 'Вторая категория',
  '2': 'Первая категория',
  '3': 'Международная категория',
};

export const countries: TypeCountries = {
  ru: 'Россия',
  by: 'Беларусь',
  kz: 'Казахстан',
};

export const sportsTypes = [
  'Самбо',
  'Дзюдо',
  'Рукопашный бой',
  'Вольная борьба',
  'Кикбоксинг',
  'Бокс',
];

export function switchTitle(
  step: 1 | 2 | 3 | 4,
  setter: Dispatch<SetStateAction<{ title: string; subtitle: string }>>,
) {
  switch (step) {
    case 1:
      setter({
        title: 'Привет!',
        subtitle: 'Это страница регистрации.',
      });
      break;
    case 2:
      setter({
        title: 'Выберите роль',
        subtitle: 'От выбранной роли будут зависеть возможности системы.',
      });
      break;
    case 3:
      setter({
        title: 'Опишите себя',
        subtitle: 'От введённой информации будут зависеть возможности системы.',
      });
      break;
    case 4:
      setter({
        title: 'Опишите себя',
        subtitle: 'От введённой информации будут зависеть возможности системы.',
      });
      break;
  }
}
