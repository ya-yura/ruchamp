'use client';

import { CustomSection } from '@/components/custom-section';
import { H3 } from '@/components/text';
import { YandexMap } from '@/components/yandex-map';
import { TypeEvent } from '@/lib/definitions';

export function AddressSection({ event }: { event: TypeEvent }) {
  const x = +event.geo.split(',')[0];
  const y = +event.geo.split(',')[1];

  return (
    <CustomSection className="flex-col items-start gap-6 pb-10">
      <H3 className="text-text-muted">Адрес</H3>
      <YandexMap x={x} y={y} title={event.name} />
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
