import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react';
import { Dictionary } from '../../dictionary-provider';
import { GenderTabs } from './teams-listing';
import { cn } from '@/lib/utils';

interface GenderFiltersProps {
  tabValue: GenderTabs;
  handleTabChange: (value: string) => void;
  dictionary: Dictionary['page']['teams'];
  className?: string;
}

export function GenderFilter({
  tabValue,
  handleTabChange,
  dictionary,
  className,
}: GenderFiltersProps) {
  //dictionary
  const labels = {
    [GenderTabs.MALE]: dictionary.filters.male,
    [GenderTabs.FEMALE]: dictionary.filters.female,
    [GenderTabs.MIXED]: dictionary.filters.mixed,
  };

  return (
    <Tabs
      className={cn('relative', className)}
      value={tabValue}
      onValueChange={handleTabChange}
    >
      <div className="flex justify-center sm:justify-start sm:h-[64px]">
        <TabsList className="flex h-auto w-fit justify-between gap-0 xl:gap-3 bg-transparent text-text-mutedLight sm:flex-row lg:w-[500px]">
          {Object.entries(GenderTabs).map(([key, value]) => (
            <TabsTrigger
              key={value}
              className="rounded-none border-[#115EA3] text-base data-[state=active]:border-b-4 data-[state=active]:bg-transparent data-[state=active]:font-bold data-[state=active]:text-white sm:text-sm"
              value={value}
            >
              {labels[value]}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
}
