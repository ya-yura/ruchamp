import React, { Dispatch, SetStateAction, useState } from 'react';
import { GenderFilter } from './gender-filter';
import { RangeSlider } from './range-slider';
import { Dictionary } from '../../dictionary-provider';
import { GenderTabs } from './teams-listing';

interface BasicFiltersProps {
  tabValue: GenderTabs;
  handleTabChange: (value: string) => void;
  ages: number[];
  setAges: Dispatch<SetStateAction<number[]>>;
  weights: number[];
  setWeights: Dispatch<SetStateAction<number[]>>;
  weightRange: number[];
  ageRange: number[];
  weightDefaults: number[];
  ageDefaults: number[];
  dictionary: Dictionary['page']['teams'];
}

export function BasicFilters({
  tabValue,
  handleTabChange,
  ages,
  setAges,
  weights,
  setWeights,
  weightRange,
  ageRange,
  weightDefaults,
  ageDefaults,
  dictionary,
}: BasicFiltersProps) {
  return (
    <div className="mb-9 grid w-full grid-cols-1 justify-between gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-14 xl:gap-28">
      <GenderFilter
        tabValue={tabValue}
        handleTabChange={handleTabChange}
        dictionary={dictionary}
      />
      <RangeSlider
        className="px-10 sm:px-0"
        title={'Возраст (лет)'}
        defaultValue={ageDefaults}
        minValue={ageRange[0]}
        maxValue={ageRange[1]}
        minStepsBetweenThumbs={1}
        value={ages}
        setValue={setAges}
      />
      <RangeSlider
        className="col-span-1 px-10 sm:col-span-2 sm:px-0 lg:col-span-1"
        title={'Вес (кг)'}
        defaultValue={weightDefaults}
        minValue={weightRange[0]}
        maxValue={weightRange[1]}
        minStepsBetweenThumbs={1}
        value={weights}
        setValue={setWeights}
      />
    </div>
  );
}
