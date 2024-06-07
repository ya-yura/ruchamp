import { Event } from '@/lib/definitions';
import { EventsCarousel } from './events-carousel';
import { CustomSection } from '@/components/custom-section';
import { ContentWraper } from '@/components/content-wraper';

export function ExpectedEvents({ events }: { events: Event[] }) {
  return (
    <CustomSection className='relative bg-transparent'>
      <ContentWraper className="items-start gap-6 pb-12">
        <h3 className="text-4xl font-bold text-[#616161]">
          Самые ожидаемые события
        </h3>
        <EventsCarousel events={events} />
      </ContentWraper>
    </CustomSection>
  );
}
