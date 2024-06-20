import * as React from 'react';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { cn } from '@/lib/utils';
import { ValueOption } from '@/app/[lang]/(unprotected)/team/[id]/page';

const options: ValueOption[] = [
  {
    value: 'login',
    displayedValue: 'Войти',
  },
  {
    value: 'register',
    displayedValue: 'Регистрация',
  },
];

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
        {options.map((option) => (
          <TabsTrigger
            key={option.value as string}
            className={cn(
              'w-1/2',
              'rounded-md border-none',
              'data-[state=active]:border-b-0 data-[state=active]:bg-white',
              'data-[state=active]:font-bold data-[state=active]:text-foreground',
            )}
            value={option.value as string}
          >
            {option.displayedValue}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
