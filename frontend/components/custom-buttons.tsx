'use client';

import { Button, ButtonProps } from '@fluentui/react-components';
import { CustomLink } from './custom-link';

type TypeButtonWithLinkProps = {
  href: string;
  lang: string;
  children: string;
} & ButtonProps;

export function ButtonWithLink({
  lang,
  href,
  children,
  ...props
}: TypeButtonWithLinkProps) {
  return (
    <Button {...(props as ButtonProps)}>
      <CustomLink href={href} lang={lang}>
        {children}
      </CustomLink>
    </Button>
  );
}
