'use client';

import { Locale } from '@/i18n.config';
import { CustomLink } from './custom-link';
import Image from 'next/image';
import {
  Subtitle1,
} from '@fluentui/react-components';
import { makeStyles } from '@fluentui/react-components';

const useOverrides = makeStyles({
  text: {
    fontSize: '25px',
    fontWeight: 'bold',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'antialiased',
  },
});

export default function Logo({ lang }: { lang: Locale }) {
  const overrides = useOverrides();
  return (
    <CustomLink href={`/`} lang={lang}>
      <Subtitle1 className={overrides.text}>RUCHAMP</Subtitle1>
    </CustomLink>
  );
}
