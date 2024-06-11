'use client';

import { TextCard } from '@/components/cards/text-card';
import { TextCardFieldWithTwoLists } from '@/components/cards/text-card-field-with-two-lists';
import {
  FilterData,
  ValueOption,
} from '../../app/[lang]/(unprotected)/team/[id]/page';
import { H4, PersonDescriptionOnCard } from '@/components/text';
import { AthleteCard } from '@/components/cards/athlete-card';
import { Checkbox } from '@/components/ui/checkbox';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckedState } from '@radix-ui/react-checkbox';
import { Locale } from '@/i18n.config';
import { calculateAge } from '@/lib/utils/date-and-time';
import { cn } from '@/lib/utils';
import { CustomSection } from '../custom-section';
import { ContentWraper } from '../content-wraper';

interface AthleteCardData {
  id?: number;
  user_id?: number;
  sirname: string;
  name: string;
  fathername: string;
  birthdate: string;
  gender: boolean;
  height?: number;
  weight: number;
  image_field: string;
  country: number;
  region: number;
  city: string;
  grade_types?: string[];
  grade?: string;
}

interface AthletesCardsWithFiltersProps {
  athletes: AthleteCardData[];
  captainId?: number;
  filtersData: FilterData[];
  className?: string;
  lang: Locale;
}

export function AthletesCardsWithFilters({
  athletes,
  captainId,
  filtersData,
  className,
  lang,
}: AthletesCardsWithFiltersProps) {
  const [filters, setFilters] = useState<Record<string, (string | number[])[]>>(
    filtersData.reduce<Record<string, (string | number[])[]>>((acc, filter) => {
      acc[filter.id] = [];
      return acc;
    }, {}),
  );

  const updateFilters = useCallback(
    (filterId: string, value: string | number[], checked: boolean) => {
      setFilters((prevVal) => {
        const newFilterValues = checked
          ? [...new Set([...(prevVal[filterId] || []), value])]
          : (prevVal[filterId] || []).filter((i) => i !== value);

        return {
          ...prevVal,
          [filterId]: newFilterValues,
        };
      });
    },
    [],
  );

  const filtredAthletes = useMemo(() => {
    const { genders, weights, grades, ages } = filters;

    return athletes.filter((member) => {
      const memberGender = member.gender ? 'male' : 'female';
      const memberAge = calculateAge(member.birthdate);
      // Check gender
      const isGenderMatch = genders.includes(memberGender);
      // Check weight
      const isWeightMatch = weights.some((range) => {
        const [min, max] = range as [number, number];
        return member.weight > min && member.weight <= max;
      });
      // Check grade
      const isGradeMatch = grades.some(
        (grade) =>
          member.grade_types?.includes(grade as string) ||
          member.grade?.includes(grade as string),
      );
      // Check age
      const isAgeMatch = ages.some((range) => {
        const [min, max] = range as [number, number];
        return memberAge > min && memberAge <= max;
      });

      return isGenderMatch && isWeightMatch && isGradeMatch && isAgeMatch;
    });
  }, [filters, athletes, filtersData]);

  return (
    <CustomSection className="relative mb-10">
      <ContentWraper>
        <TextCardFieldWithTwoLists
          className={cn('w-full', className)}
          ariaLabelledby="athletes"
          firstList={
            <AthletesList athletes={filtredAthletes} captainId={captainId} />
          }
          secondList={
            !!athletes.length && (
              <Filters
                filtersData={filtersData}
                updateFilters={updateFilters}
              />
            )
          }
        />
      </ContentWraper>
    </CustomSection>
  );
}

function AthletesList({
  athletes,
  captainId,
}: {
  athletes: AthleteCardData[];
  captainId?: number;
}) {
  return (
    <>
      {!!athletes.length ? (
        athletes.map((athlete, index) => (
          <AthleteCard
            key={athlete.id || athlete.user_id || index}
            id={athlete.id || athlete.user_id || index}
            sirname={athlete.sirname}
            name={athlete.name}
            fathername={athlete.fathername}
            birthdate={athlete.birthdate}
            city={athlete.city}
            country={athlete.country}
            region={athlete.region}
            image_field={athlete.image_field}
            weight={athlete.weight}
            grade_types={athlete.grade_types}
            grade={athlete.grade}
            captainId={captainId}
          />
        ))
      ) : (
        <PersonDescriptionOnCard className="mb-5 mr-auto text-base text-background">
          Ничего не найдено
        </PersonDescriptionOnCard>
      )}
    </>
  );
}

interface FiltersProps {
  filtersData: FilterData[];
  updateFilters: (
    filterId: string,
    value: string | number[],
    checked: boolean,
  ) => void;
}

function Filters({ filtersData, updateFilters }: FiltersProps) {
  return (
    <TextCard className="bg-card-backgroundDark">
      <ul className="flex flex-col gap-6">
        {filtersData.map((filter) => (
          <FilterItem
            key={filter.id}
            id={filter.id}
            title={filter.title}
            options={filter.options}
            updateFilters={updateFilters}
          />
        ))}
      </ul>
    </TextCard>
  );
}

interface FilterItemProps extends FilterData {
  updateFilters: (
    filterId: string,
    value: string | number[],
    checked: boolean,
  ) => void;
}

function FilterItem({ id, title, options, updateFilters }: FilterItemProps) {
  return (
    <li className="flex flex-col gap-5">
      <H4 className="text-white">{title}</H4>
      <ul className="flex flex-col gap-3">
        {options.map((option) => (
          <FilterCheckbox
            key={`${id}-${option.displayedValue}`}
            id={id}
            displayedValue={option.displayedValue}
            value={option.value}
            updateFilters={updateFilters}
          />
        ))}
      </ul>
    </li>
  );
}

interface FilterCheckboxProps extends ValueOption {
  id: FilterData['id'];
  updateFilters: (
    filterId: string,
    value: string | number[],
    checked: boolean,
  ) => void;
}

function FilterCheckbox({
  id,
  displayedValue,
  value,
  updateFilters,
}: FilterCheckboxProps) {
  const [checked, setChecked] = useState<CheckedState | undefined>(true);

  useEffect(() => {
    updateFilters(id, value, checked === true);
  }, [checked, id, value, updateFilters]);

  return (
    <li key={`${id}-${value}`} className="flex items-center space-x-2">
      <Checkbox
        id={`${id}-${value}`}
        checked={checked}
        onCheckedChange={setChecked}
      />
      <label
        htmlFor={`${id}-${value}`}
        className="text-base font-medium leading-none text-text-muted peer-disabled:cursor-not-allowed peer-disabled:opacity-70 peer-data-[state=checked]:text-white"
      >
        {displayedValue}
      </label>
    </li>
  );
}
