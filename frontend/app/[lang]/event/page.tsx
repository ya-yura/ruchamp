'use client';

import React, { useState } from 'react';
import { EventHero } from './event-hero';
import {
  SelectTabData,
  SelectTabEvent,
  TabValue,
  Text,
} from '@fluentui/react-components';

export default function Event() {
  const [selectedValue, setSelectedValue] = useState<TabValue>('info');

  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    setSelectedValue(data.value);
  };

  const Info = React.memo(() => (
    <div role="tabpanel" aria-labelledby="info">
      <Text>Информация</Text>
    </div>
  ));

  const Athletes = React.memo(() => (
    <div role="tabpanel" aria-labelledby="athletes">
      <Text>Спортсмены</Text>
    </div>
  ));

  const Matches = React.memo(() => (
    <div role="tabpanel" aria-labelledby="matches">
      <Text>Матчи</Text>
    </div>
  ));

  const Grid = React.memo(() => (
    <div role="tabpanel" aria-labelledby="grid">
      <Text>Турнирная сетка</Text>
    </div>
  ));

  const Results = React.memo(() => (
    <div role="tabpanel" aria-labelledby="results">
      <Text>Результаты</Text>
    </div>
  ));

  return (
    <main className="flex min-h-[calc(100vh-137px)] flex-col items-center justify-start py-3">
      <EventHero selectedValue={selectedValue} onTabSelect={onTabSelect} />
      <div className="">
        {selectedValue === 'info' && <Info />}
        {selectedValue === 'athletes' && <Athletes />}
        {selectedValue === 'matches' && <Matches />}
        {selectedValue === 'grid' && <Grid />}
        {selectedValue === 'results' && <Results />}
      </div>
    </main>
  );
}
