import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React, { useCallback, useState } from 'react';
import { Dictionary } from '../../dictionary-provider';

enum GenderTabs {
  MALE = 'male',
  FEMALE = 'female',
  MIXED = 'mixed',
}

interface GenderFiltersProps {
  dictionary: Dictionary['page']['teams'];
}

export function GenderFilter({ dictionary }: GenderFiltersProps) {
  const [tabValue, setTabValue] = useState<GenderTabs>(GenderTabs.MALE);
  //dictionary
  const labels = {
    [GenderTabs.MALE]: dictionary.filters.male,
    [GenderTabs.FEMALE]: dictionary.filters.female,
    [GenderTabs.MIXED]: dictionary.filters.mixed,
  };
  const handleTabChange = useCallback((value: string) => {
    setTabValue(value as GenderTabs);
  }, []);
  return (
    <Tabs
      className="relative mx-auto mb-10 w-1/3"
      value={tabValue}
      onValueChange={handleTabChange}
    >
      <div className="flex h-[164px] w-1/3 sm:h-[64px]">
        <TabsList className="mx-auto mb-5 flex h-auto w-fit flex-col justify-between gap-3 bg-transparent text-[#D6D6D6] sm:flex-row lg:w-[500px]">
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
