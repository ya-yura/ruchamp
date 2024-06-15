import { Event } from '@/lib/definitions';
import { EventsCarousel } from './events-carousel';
import { CustomSection } from '@/components/custom-section';
import { ContentWraper } from '@/components/content-wraper';
import { Locale } from '@/i18n.config';

export function ExpectedEvents({
  events,
  lang,
}: {
  events: Event[];
  lang: Locale;
}) {
  return (
    <CustomSection className="relative bg-transparent">
      <ContentWraper className="items-start gap-6 pb-12">
        <h3 className="text-4xl font-bold text-[#616161]">
          Самые ожидаемые события
        </h3>
        <EventsCarousel events={events} lang={lang} />
      </ContentWraper>
    </CustomSection>
  );
}
