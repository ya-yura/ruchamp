'use client';

import { Badge } from '@fluentui/react-components';
import Image from 'next/image';
import { makeStyles, tokens, shorthands } from '@fluentui/react-components';

const useOverrides = makeStyles({
  badge: {
    backgroundColor: tokens.colorNeutralForegroundInverted,
    fontSize: '16px',
    letterSpacing: '-0.5px',
    ...shorthands.padding('6px', '16px'),
  },
});

export default function Event() {
  const overrides = useOverrides();
  return (
    <main className="flex min-h-[calc(100vh-137px)] flex-col items-center justify-start py-3">
      <section className="relative flex h-[720px] w-full flex-col items-center justify-start px-[72px]">
        <Image
          className="absolute top-[-93px] opacity-50"
          src="/ru/images/event-hero-bg.jpeg"
          alt={'ДОБАВИТЬ ОПИСАНИЕ'}
          width={1280}
          height={720}
          // fill={true}
          style={{ objectFit: 'cover' }}
        />
        <div className="flex flex-wrap gap-3 max-w-5xl self-start">
          <Badge
            className={overrides.badge}
            size="extra-large"
            appearance="filled"
          >
            Главное
          </Badge>
          <Badge
            className={overrides.badge}
            size="extra-large"
            appearance="filled"
          >
            Айкидо
          </Badge>
          <Badge
            className={overrides.badge}
            size="extra-large"
            appearance="filled"
          >
            Вольная борьба
          </Badge>
          <Badge
            className={overrides.badge}
            size="extra-large"
            appearance="filled"
          >
            Греко-римская борьба
          </Badge>
          <Badge
            className={overrides.badge}
            size="extra-large"
            appearance="filled"
          >
            Джиу-джитсу
          </Badge>
          <Badge
            className={overrides.badge}
            size="extra-large"
            appearance="filled"
          >
            Дзюдо
          </Badge>
          <Badge
            className={overrides.badge}
            size="extra-large"
            appearance="filled"
          >
            Карате
          </Badge>
          <Badge
            className={overrides.badge}
            size="extra-large"
            appearance="filled"
          >
            Кикбоксинг
          </Badge>
          <Badge
            className={overrides.badge}
            size="extra-large"
            appearance="filled"
          >
            Рукопашный бой
          </Badge>
          <Badge
            className={overrides.badge}
            size="extra-large"
            appearance="filled"
          >
            Самбо
          </Badge>
          <Badge
            className={overrides.badge}
            size="extra-large"
            appearance="filled"
          >
            Сумо
          </Badge>
          <Badge
            className={overrides.badge}
            size="extra-large"
            appearance="filled"
          >
            Тхэквондо
          </Badge>
          <Badge
            className={overrides.badge}
            size="extra-large"
            appearance="filled"
          >
            Ушу
          </Badge>
        </div>
      </section>
    </main>
  );
}
