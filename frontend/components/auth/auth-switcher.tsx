import * as React from 'react';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

export function AuthSwitcher({
  selectedValue,
  onTabSelect,
}: {
  selectedValue: string;
  onTabSelect: (value: string) => void;
}) {
  return (
    <Tabs
      defaultValue="login"
      className="w-full"
      onValueChange={onTabSelect}
      value={selectedValue}
    >
      <TabsList className="flex w-full">
        <TabsTrigger className="w-1/3 sm:w-1/2" value="login">
          Войти
        </TabsTrigger>
        <TabsTrigger className="w-2/3 sm:w-1/2" value="register">
          Регистрация
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
