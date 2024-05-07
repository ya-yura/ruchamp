'use client';

import { CustomSection } from '@/components/custom-section';
import { H3 } from '@/components/text';
import { TypeEvent } from '@/lib/definitions';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

export function AddressSection({ event }: { event: TypeEvent }) {
  const x = +event.geo.split(',')[0];
  const y = +event.geo.split(',')[1];

  return (
    <CustomSection className="flex-col items-start gap-6 pb-10">
      <H3 className="text-text-muted">Адрес</H3>
      <YMaps query={{ lang: 'ru_RU' }}>
        <Map
          state={{ center: [x, y], zoom: 9, controls: [] }}
          width="100%"
          height="400px"
        >
          <Placemark geometry={[x, y]} />
        </Map>
      </YMaps>
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
