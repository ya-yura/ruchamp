import * as React from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Tab,
  TabList,
} from '@fluentui/react-components';

export function InfoSwitcher({
  selectedValue,
  onTabSelect,
}: {
  selectedValue: any;
  onTabSelect: any;
}) {
  
  return (
    <TabList selectedValue={selectedValue} onTabSelect={onTabSelect}>
      <Tab id="info" value="info">
        Информация
      </Tab>
      <Tab id="athletes" value="athletes">
        Спортсмены
      </Tab>
      <Tab id="matches" value="matches">
        Матчи
      </Tab>
      <Tab id="grid" value="grid">
        Турнирная сетка
      </Tab>
      <Tab id="results" value="results">
        Результаты
      </Tab>
    </TabList>
  );
}
