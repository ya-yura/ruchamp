import { ButtonProps } from '@fluentui/react-components';

export type TypeLinksDropdown = {
  name: string;
  url: string;
};

export type TypeLoginFields = {
  username: string;
  password: string;
};

export type TypeRegisterFields = {
  email: string;
  password: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  username: string;
  name: string;
  sirname: string;
  fathername: string;
  gender: boolean;
  country: string;
  birthdate: Date;
  role_id: 1 | 2 | 3 | 4 | 5;
};

export type TypeUser = Omit<TypeRegisterFields, 'password'> & {
  id: number;
};

export type TypeCustomLinkProps = {
  href: string;
  lang: string;
  children: React.ReactNode;
} & React.RefAttributes<HTMLAnchorElement>;

export type TypeButtonWithLinkProps = {
  href: string;
  lang: string;
  children: string;
} & ButtonProps;
