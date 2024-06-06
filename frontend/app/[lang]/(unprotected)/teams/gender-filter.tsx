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
      <div className="flex justify-center sm:h-[64px] sm:justify-start">
        <TabsList className="flex h-auto w-fit justify-between gap-0 bg-transparent text-text-mutedLight sm:flex-row lg:w-[500px] xl:gap-3">
          {Object.entries(GenderTabs).map(([key, value]) => (
            <TabsTrigger key={value} value={value}>
              {labels[value]}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
}
