'use client';

import { ContentWraper } from '@/components/content-wraper';
import { TypeEvent } from '@/lib/definitions';
import { EventsCarousel } from './events-carousel';
import { CustomSection } from '@/components/custom-section';

export function ExpectedEvents({ events }: { events: Array<TypeEvent> }) {
  return (
    <CustomSection className="pb-12 gap-6 items-start">
        <h3 className="text-4xl font-bold text-[#616161]">
          Самые ожидаемые события
        </h3>
        <EventsCarousel events={events} />
    </CustomSection>
  );
}
