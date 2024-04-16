'use client';

import { ContentWraper } from '@/components/content-wraper';
import { TypeEvent } from '@/lib/definitions';
import { EventsCarousel } from './events-carousel';

export function ExpectedEvents({ events }: { events: Array<TypeEvent> }) {
  return (
    <section className="flex w-full flex-col px-[72px] mb-12">
      <ContentWraper className="gap-6">
        <h3 className="text-4xl font-bold text-[#616161]">
          Самые ожидаемые события
        </h3>
        <EventsCarousel events={events} />
      </ContentWraper>
    </section>
  );
}
