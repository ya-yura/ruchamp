'use client';

import { Body1, Display } from '@fluentui/react-components';
import { makeStyles, tokens, shorthands } from '@fluentui/react-components';

type TypeGreetingsProps = {
  title: string;
  subtitle: string;
};

const useOverrides = makeStyles({
  title: { fontSize: '48px', lineHeight: '50px' },
});

export function Greetings({ title, subtitle }: TypeGreetingsProps) {
  const overrides = useOverrides();
  return (
    <div className="flex w-1/2 items-center justify-center">
      <div className="flex w-3/5 flex-col gap-6 text-[#E0E0E0]">
        <Display as="h1" className={overrides.title}>
          <b>{title}</b>
        </Display>
        <Body1 as="p">{subtitle}</Body1>
      </div>
    </div>
  );
}
