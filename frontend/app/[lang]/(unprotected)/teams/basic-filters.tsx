import React, { Dispatch, SetStateAction } from 'react';
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
  dictionary: Dictionary['page']['teams'];
}

export function BasicFilters({
  tabValue,
  handleTabChange,
  ages,
  setAges,
  weights,
  setWeights,
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
        defaultValue={[18, 30]}
        minValue={5}
        maxValue={100}
        minStepsBetweenThumbs={1}
        value={ages}
        setValue={setAges}
      />
      <RangeSlider
        className="col-span-1 px-10 sm:col-span-2 sm:px-0 lg:col-span-1"
        title={'Вес (кг)'}
        defaultValue={[50, 90]}
        minValue={30}
        maxValue={150}
        minStepsBetweenThumbs={1}
        value={weights}
        setValue={setWeights}
      />
    </div>
  );
}
