export type TypeLinksDropdown = {
  name: string;
  url: string;
};

export type TypeLoginFields = {
  username: string;
  password: string;
};

export type CustomLinkProps = {
  href: string
  lang: string
  children: React.ReactNode
  [key: string]: any
}