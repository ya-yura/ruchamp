'use client';

import { TextCard } from '@/components/cards/text-card';
import { TextCardFieldWithTwoLists } from '@/components/cards/text-card-field-with-two-lists';
import { FilterData, TeamMember, ValueOption } from './page';
import { H4, PersonDescriptionOnCard } from '@/components/text';
import { AthleteCard } from '@/components/cards/athlete-card';
import { Checkbox } from '@/components/ui/checkbox';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckedState } from '@radix-ui/react-checkbox';
import { calculateAge } from '@/lib/utils';

interface AthletesTeamProps {
  athletes: TeamMember[];
  captainId: number;
  genderFilterData: FilterData;
  weightFilterData: FilterData;
  gradeFilterData: FilterData;
  ageFilterData: FilterData;
}

export function AthletesTeam({
  athletes,
  captainId,
  genderFilterData,
  weightFilterData,
  gradeFilterData,
  ageFilterData,
}: AthletesTeamProps) {
  const [filters, setFilters] = useState<Record<string, (string | number[])[]>>(
    {
      [genderFilterData.id]: [],
      [weightFilterData.id]: [],
      [gradeFilterData.id]: [],
      [ageFilterData.id]: [],
    },
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
      const isGradeMatch = grades.some((grade) =>
        member.grade_types.includes(grade as string),
      );
      // Check age
      const isAgeMatch = ages.some((range) => {
        const [min, max] = range as [number, number];
        return memberAge > min && memberAge <= max;
      });

      return isGenderMatch && isWeightMatch && isGradeMatch && isAgeMatch;
    });
  }, [
    filters,
    athletes,
    genderFilterData.id,
    weightFilterData.id,
    gradeFilterData.id,
    ageFilterData.id,
  ]);

  return (
    <TextCardFieldWithTwoLists
      firstList={
        <AthletesList athletes={filtredAthletes} captainId={captainId} />
      }
      secondList={
        <Filters
          genderFilterData={genderFilterData}
          weightFilterData={weightFilterData}
          gradeFilterData={gradeFilterData}
          ageFilterData={ageFilterData}
          updateFilters={updateFilters}
        />
      }
    />
  );
}

function AthletesList({
  athletes,
  captainId,
}: {
  athletes: TeamMember[];
  captainId: number;
}) {
  return (
    <>
      {!!athletes.length ? (
        athletes.map((athlete) => (
          <AthleteCard
            key={athlete.id}
            id={athlete.id}
            sirname={athlete.sirname}
            name={athlete.name}
            fathername={athlete.fathername}
            birthdate={athlete.birthdate}
            city={athlete.city}
            country={athlete.country}
            region={athlete.region}
            image_field={athlete.image_field}
            weight={athlete.weight}
            captainId={captainId}
          />
        ))
      ) : (
        <PersonDescriptionOnCard>Никого не найдено</PersonDescriptionOnCard>
      )}
    </>
  );
}

interface FiltersProps {
  genderFilterData: FilterData;
  weightFilterData: FilterData;
  gradeFilterData: FilterData;
  ageFilterData: FilterData;
  updateFilters: (
    filterId: string,
    value: string | number[],
    checked: boolean,
  ) => void;
}

function Filters({
  genderFilterData,
  weightFilterData,
  gradeFilterData,
  ageFilterData,
  updateFilters,
}: FiltersProps) {
  return (
    <TextCard className="bg-card-backgroundDark">
      <ul className="flex flex-col gap-6">
        <FilterItem
          id={genderFilterData.id}
          title={genderFilterData.title}
          options={genderFilterData.options}
          updateFilters={updateFilters}
        />
        <FilterItem
          id={weightFilterData.id}
          title={weightFilterData.title}
          options={weightFilterData.options}
          updateFilters={updateFilters}
        />
        <FilterItem
          id={gradeFilterData.id}
          title={gradeFilterData.title}
          options={gradeFilterData.options}
          updateFilters={updateFilters}
        />
        <FilterItem
          id={ageFilterData.id}
          title={ageFilterData.title}
          options={ageFilterData.options}
          updateFilters={updateFilters}
        />
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
