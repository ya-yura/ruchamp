'use client';

import { Button, ButtonProps } from '@fluentui/react-components';
import { CustomLink } from './custom-link';
import { makeStyles, mergeClasses } from '@fluentui/react-components';

type ButtonWithLinkProps = {
  href: string;
  lang: string;
  textPosition: 'right' | 'left';
  children: string;
} & ButtonProps;

const useOverrides = makeStyles({
  button: {
    display: 'flex',
  },
  textLeft: {
    justifyContent: 'flex-start',
  },
  textRight: {
    justifyContent: 'flex-end',
  },
});

export function ButtonWithLink({
  lang,
  href,
  textPosition,
  children,
  ...props
}: ButtonWithLinkProps) {
  const overrides = useOverrides();
  return (
    <Button
      className={mergeClasses(
        overrides.button,
        textPosition === 'left' ? overrides.textLeft : overrides.textRight,
      )}
      {...(props as ButtonProps)}
    >
      <CustomLink href={href} lang={lang}>
        {children}
      </CustomLink>
    </Button>
  );
}
