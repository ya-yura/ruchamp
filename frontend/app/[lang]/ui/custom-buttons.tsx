'use client';

import { Button, ButtonProps } from '@fluentui/react-components';
import { CustomLink } from './custom-link';
import { TypeButtonWithLinkProps } from '@/lib/definitions';
import { signOut } from 'next-auth/react';

export const ButtonWithLink = ({
  lang,
  href,
  children,
  ...props
}: TypeButtonWithLinkProps) => (
  <Button {...props}>
    <CustomLink href={href} lang={lang}>
      {children}
    </CustomLink>
  </Button>
);
