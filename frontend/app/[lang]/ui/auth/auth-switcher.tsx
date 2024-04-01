import * as React from 'react';
import {
  Tab,
  TabList,
} from '@fluentui/react-components';

export function AuthSwitcher({
  selectedValue,
  onTabSelect,
}: {
  selectedValue: any;
  onTabSelect: any;
}) {
  
  return (
    <TabList selectedValue={selectedValue} onTabSelect={onTabSelect}>
      <Tab id="login" value="login">
        Войти
      </Tab>
      <Tab id="register" value="register">
        Зарегистрироваться
      </Tab>
    </TabList>
  );
}
