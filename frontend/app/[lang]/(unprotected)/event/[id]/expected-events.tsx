import { TypeEvent } from '@/lib/definitions';
import { EventsCarousel } from './events-carousel';
import { CustomSection } from '@/components/custom-section';

export function ExpectedEvents({ events }: { events: Array<TypeEvent> }) {
  return (
    <CustomSection className="items-start gap-6 pb-12">
      <h3 className="text-4xl font-bold text-[#616161]">
        Самые ожидаемые события
      </h3>
      <EventsCarousel events={events} />
    </CustomSection>
  );
}
