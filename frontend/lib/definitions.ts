import { ButtonProps } from '@fluentui/react-components';

export type TypeLinksDropdown = {
  name: string;
  url: string;
};

export type TypeLoginFields = {
  username: string;
  password: string;
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
