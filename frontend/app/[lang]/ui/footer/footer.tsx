'use client';

import {
  Divider,
  Subtitle1,
  Link,
  Text,
  Body2,
  Caption1,
} from '@fluentui/react-components';
import { makeStyles, tokens, shorthands } from '@fluentui/react-components';

type TypeLinkData = {
  text: string;
  url: string;
};

const useStyles = makeStyles({
  footer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: tokens.colorNeutralBackground4,
    width: '100%',
    ...shorthands.padding('0px', '72px', '24px', '72px'),
  },
  divider: {
    marginBottom: '30px',
  },
  title: {
    color: tokens.colorNeutralForeground4,
    fontWeight: '700',
  },
  linkText: {
    color: tokens.colorNeutralStrokeDisabled,
    ...shorthands.transition('all', '0.4s'),
    '&:hover': {
      color: tokens.colorNeutralForeground4,
      textDecorationLine: 'none',
    },
  },
  copyRight: {
    color: tokens.colorNeutralStrokeDisabled,
  },
});

const LinkData1: TypeLinkData[] = [
  {
    text: 'Справка',
    url: '/',
  },
  {
    text: 'Пользовательское соглашение',
    url: '/',
  },
  {
    text: 'Подарочные сертифиакаты',
    url: '/',
  },
  {
    text: 'Возврат билетов',
    url: '/',
  },
  {
    text: 'Участие в исследованиях',
    url: '/',
  },
  {
    text: 'Правила рекомендаций',
    url: '/',
  },
];

const LinkData2: TypeLinkData[] = [
  {
    text: 'Партнёрам и организаторам мероприятий',
    url: '/',
  },
  {
    text: 'Билетная система РуЧамп',
    url: '/',
  },
  {
    text: 'Корпоративным клиентам',
    url: '/',
  },
];

const LinkData3: TypeLinkData[] = [
  {
    text: 'Согласие на обработку персональных данных',
    url: '/',
  },
  {
    text: 'Статистика',
    url: '/',
  },
  {
    text: 'Реклама',
    url: '/',
  },
];

export function Footer() {
  const styles = useStyles();

  return (
    <footer className={styles.footer}>
      <Divider className={styles.divider} />
      <nav className="flex items-start justify-start gap-36">
        <div className="mb-11 flex flex-col gap-5">
          <Subtitle1 as="h4" className={styles.title}>
            РуЧамп
          </Subtitle1>
          <ul className="flex flex-col gap-2">
            {LinkData1.map((item) => (
              <li key={item.text}>
                <Link // check this liks later!!! This is links from Fluent, but should be from Next
                  as="a"
                  className={styles.linkText}
                  appearance="subtle"
                  href={item.url}
                >
                  <Body2 as="p">{item.text}</Body2>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-5">
          <Subtitle1 as="h4" className={styles.title}>
            Партнёрам и организаторам
          </Subtitle1>
          <ul className="flex flex-col gap-2">
            {LinkData2.map((item) => (
              <li key={item.text}>
                <Link
                  as="a"
                  className={styles.linkText}
                  appearance="subtle"
                  href={item.url}
                >
                  <Body2 as="p">{item.text}</Body2>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div className="flex items-center justify-between">
        <ul className="flex gap-9">
          {LinkData3.map((item) => (
            <li key={item.text}>
              <Link
                as="a"
                className={styles.linkText}
                appearance="subtle"
                href={item.url}
              >
                <Caption1 as="p">{item.text}</Caption1>
              </Link>
            </li>
          ))}
        </ul>
        <Text as="p" className={styles.copyRight}>
          © 2024 — «РуЧамп»
        </Text>
      </div>
    </footer>
  );
}
