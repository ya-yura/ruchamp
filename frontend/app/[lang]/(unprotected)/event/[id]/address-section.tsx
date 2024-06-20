'use client';

import { ContentWraper } from '@/components/content-wraper';
import { CustomSection } from '@/components/custom-section';
import { H3 } from '@/components/text';
import { YandexMap } from '@/components/yandex-map';
import { Event } from '@/lib/definitions';

export function AddressSection({ event }: { event: Event }) {
  return (
    <CustomSection className="relative bg-transparent">
      <ContentWraper className="items-start gap-6 pb-10">
        <H3 className="m text-text-muted">Адрес</H3>
        <YandexMap places={[event]} mapId="eventMap" />
        <div className="flex flex-col">
          <p className="text-base font-normal text-text-muted">
            {event.location}
          </p>
          <p className="text-base font-normal text-text-muted">
            +7 (863) 214-11-17
          </p>
        </div>
      </ContentWraper>
    </CustomSection>
  );
}
