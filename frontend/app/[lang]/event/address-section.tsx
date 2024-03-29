'use client';

import { Body2, Title1 } from '@fluentui/react-components';
import { makeStyles, tokens } from '@fluentui/react-components';
import Image from 'next/image';

const useOverrides = makeStyles({
  title: { color: tokens.colorNeutralForeground4, fontWeight: '700' },
  text: { color: tokens.colorNeutralForeground4 },
});

export function AddressSection() {
  const overrides = useOverrides();

  return (
    <section className="flex w-full flex-col gap-6 px-[72px] py-3">
      <Title1 className={overrides.title}>Адрес</Title1>
      <div className="relative flex h-[274px] w-full">
        <Image
          className="abusolute"
          src="/ru/images/map.png"
          alt={'ДОБАВИТЬ ОПИСАНИЕ'}
          fill={true}
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="flex flex-col">
        <Body2 className={overrides.text}>Ледовый дворец Ice Palace</Body2>
        <Body2 className={overrides.text}>ул. Пригородная, 24/2</Body2>
        <Body2 className={overrides.text}>+7 (863) 214-11-17</Body2>
      </div>
    </section>
  );
}
