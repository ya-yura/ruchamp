import { Button } from '@fluentui/react-components';
import { CustomLink } from './custom-link';
import { TypeButtonWithLinkProps } from '@/lib/definitions';

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
