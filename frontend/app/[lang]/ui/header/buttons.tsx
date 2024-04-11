'use client';

import {
  KeyMultiple20Regular,
  PersonBoard20Regular,
} from '@fluentui/react-icons';
import { ButtonWithLink } from '../custom-buttons';
import { Locale } from '@/i18n.config';
import { makeStyles, tokens } from '@fluentui/react-components';

const useOverrides = makeStyles({
  button: {
    backgroundColor: tokens.colorNeutralBackgroundInverted,
    color: tokens.colorNeutralForegroundInverted,
  },
});

export function AuthButtons({ lang }: { lang: Locale }) {
  const overrides = useOverrides();

  return (
    <div className="flex gap-4">
      <ButtonWithLink
        lang={lang}
        href="/register"
        size="medium"
        appearance="primary"
        icon={<PersonBoard20Regular />}
      >
        Зарегистрироваться
      </ButtonWithLink>
      <ButtonWithLink
        className={overrides.button}
        lang={lang}
        href="/login"
        size="medium"
        appearance="secondary"
        icon={<KeyMultiple20Regular />}
      >
        Войти
      </ButtonWithLink>
    </div>
  );
}
