'use client';

import { useState } from 'react';
import { EventHero } from './event-hero';
import { InfoSection } from './info-section';
import {
  SelectTabData,
  SelectTabEvent,
  TabValue,
} from '@fluentui/react-components';

export function EventInfo() {
  const [selectedValue, setSelectedValue] = useState<TabValue>('info');

  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    setSelectedValue(data.value);
  };
  return (
    <>
      <EventHero selectedValue={selectedValue} onTabSelect={onTabSelect} />
      <InfoSection selectedValue={selectedValue} />
    </>
  );
}
