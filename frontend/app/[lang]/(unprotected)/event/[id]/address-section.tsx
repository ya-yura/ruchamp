import { ContentWraper } from '@/components/content-wraper';
import { TypeEvent } from '@/lib/definitions';

export function AddressSection({ event }: { event: TypeEvent }) {
  return (
    <section className="relative pb-10 flex w-full flex-col px-[72px] bg-primary-background">
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
