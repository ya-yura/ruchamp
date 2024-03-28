'use client';

import React, { useState } from 'react';
import { EventHero } from './event-hero';
import {
  SelectTabData,
  SelectTabEvent,
  TabValue,
} from '@fluentui/react-components';
import { InfoSection } from './info-section';
import { AddressSection } from './address-section';
import { Container } from '../ui/container';

export default function Event() {
  const [selectedValue, setSelectedValue] = useState<TabValue>('info');

  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    setSelectedValue(data.value);
  };

  return (
    <Container>
      <EventHero selectedValue={selectedValue} onTabSelect={onTabSelect} />
      <InfoSection selectedValue={selectedValue} />
      <AddressSection />
    </Container>
  );
}
