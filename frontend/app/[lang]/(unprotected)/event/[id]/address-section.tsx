'use client';

import { makeStyles, tokens } from '@fluentui/react-components';
import Image from 'next/image';
import { ContentWraper } from '@/components/content-wraper';
import { TypeEvent } from '@/lib/definitions';

const useOverrides = makeStyles({
  title: {
    color: tokens.colorNeutralForeground4,
    fontWeight: '700',
  },
  text: { color: tokens.colorNeutralForeground4 },
});

export function AddressSection({ event }: { event: TypeEvent }) {
  const overrides = useOverrides();

  return (
    <section className="mb-10 flex w-full flex-col px-[72px]">
      <ContentWraper className="gap-6">
        <h3 className="text-4xl font-bold text-[#616161]">Адрес</h3>
        {/* <div className="relative flex w-full"> */}
        <iframe
          src="https://yandex.com/map-widget/v1/?um=constructor%3A0c8f20b1bfdf1e7aebfeaa0f32d2c5ddf31a7501827614526ecbfa4a1f57b501&amp;source=constructor"
          width="100%"
          height="400"
        ></iframe>
        {/* </div> */}
        <div className="flex flex-col">
          <p className="text-base font-normal text-[#707070]">
            {event.location}
          </p>
          <p className="text-base font-normal text-[#707070]">
            +7 (863) 214-11-17
          </p>
        </div>
      </ContentWraper>
    </section>
  );
}
