'use client';

import { useState } from 'react';
import { EventHero } from './event-hero';
import { InfoSection } from './info-section';
import {
  SelectTabData,
  SelectTabEvent,
  TabValue,
} from '@fluentui/react-components';
import { TypeEvent } from '@/lib/definitions';

export function EventInfo({ event }: {event: TypeEvent | undefined}) {
  const [selectedValue, setSelectedValue] = useState<TabValue>('info');

  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    setSelectedValue(data.value);
  };

  return (
    <>
      <EventHero event={event} selectedValue={selectedValue} onTabSelect={onTabSelect} />
      <InfoSection selectedValue={selectedValue} />
    </>
  );
}
