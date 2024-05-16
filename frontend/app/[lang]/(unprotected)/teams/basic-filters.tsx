import React from 'react';
import { GenderFilter } from './gender-filter';
import { AgeFilter } from './age-filter';
import { WeightFilter } from './weight-filter';
import { Dictionary } from '../../dictionary-provider';

interface BasicFiltersProps {
  dictionary: Dictionary['page']['teams'];
}

export function BasicFilters({ dictionary }: BasicFiltersProps) {
  return (
    <div className="flex justify-between w-full">
      <GenderFilter dictionary={dictionary}/>
      <AgeFilter />
      <WeightFilter />
    </div>
  );
}
