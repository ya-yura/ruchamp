'use client';

import React, { useState } from 'react';
import { EventHero } from './event-hero';
import {
  SelectTabData,
  SelectTabEvent,
  TabValue,
} from '@fluentui/react-components';
import { InfoBlock } from './info-block';

export default function Event() {
  const [selectedValue, setSelectedValue] = useState<TabValue>('info');

  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    setSelectedValue(data.value);
  };

  return (
    <main className="flex min-h-[calc(100vh-137px)] flex-col items-center justify-start pt-3">
      <EventHero selectedValue={selectedValue} onTabSelect={onTabSelect} />
      <InfoBlock selectedValue={selectedValue} />
    </main>
  );
}
