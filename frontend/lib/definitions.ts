import { ButtonProps } from '@fluentui/react-components';

export type TypeHttpRequest = {
  baseUrl: string;
  headers: { 'Content-Type': string; Authorization: string };
};

export type TypeLinksDropdown = {
  name: string;
  url: string;
};

export type TypeLoginFields = {
  username: string;
  password: string;
};

export type TypeStringUserFields = {
  email: string;
  password: string;
  repeatPassword: string;
  username: string;
  name: string;
  sirname: string;
  fathername: string;
  country: string;
  birthdate: string;
};

export type TypeBooleanUserFields = {
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  gender: boolean;
};

export type TypeUserRole = {
  role_id: 1 | 2 | 3 | 4 | 5;
};

export type TypeRegisterFields = TypeStringUserFields &
  TypeBooleanUserFields &
  TypeUserRole;

export type TypeUser = Omit<TypeRegisterFields, 'password'> & {
  id: number;
};

export type TypeCustomLinkProps = {
  href: string;
  lang: string;
  children: React.ReactNode;
} & React.RefAttributes<HTMLAnchorElement>;

