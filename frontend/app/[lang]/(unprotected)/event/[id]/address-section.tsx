import { ContentWraper } from '@/components/content-wraper';
import { CustomSection } from '@/components/custom-section';
import { H3 } from '@/components/text';
import { TypeEvent } from '@/lib/definitions';

export function AddressSection({ event }: { event: TypeEvent }) {
  return (
    <CustomSection className="flex-col items-start gap-6 pb-10">
      <H3 className="text-text-muted">Адрес</H3>
      <iframe
        src="https://yandex.com/map-widget/v1/?um=constructor%3A0c8f20b1bfdf1e7aebfeaa0f32d2c5ddf31a7501827614526ecbfa4a1f57b501&amp;source=constructor"
        width="100%"
        height="400"
      ></iframe>
      <div className="flex flex-col">
        <p className="text-text-muted text-base font-normal">
          {event.location}
        </p>
        <p className="text-text-muted text-base font-normal">
          +7 (863) 214-11-17
        </p>
      </div>
    </CustomSection>
  );
}
