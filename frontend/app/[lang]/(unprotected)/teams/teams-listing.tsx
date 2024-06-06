'use client';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FilterByType } from '../events/filter-by-type';
import { CustomSection } from '@/components/custom-section';
import { ContentWraper } from '@/components/content-wraper';
import { BigCardsWithImageField } from '@/components/cards/big-cards-with-image-field';
import { Locale } from '@/i18n.config';
import { Team } from './page';
import { BasicFilters } from './basic-filters';
import { Dictionary } from '../../dictionary-provider';
import { defineDefaultRange } from '@/lib/utils/math-utils';

export enum GenderTabs {
  MALE = 'male',
  FEMALE = 'female',
  MIXED = 'mixed',
}

interface TeamsListingProps {
  sportTypes: string[];
  teams: Team[];
  weightRange: number[];
  ageRange: number[];
  weightDefaults: number[];
  ageDefaults: number[];
  lang: Locale;
  dictionary: Dictionary['page']['teams'];
}

export function TeamsListing({
  sportTypes,
  teams,
  weightRange,
  ageRange,
  weightDefaults,
  ageDefaults,
  lang,
  dictionary,
}: TeamsListingProps) {
  const [selectedSportTypes, setSelectedSportTypes] = useState<string[]>([]);
  const [genderValue, setGenderValue] = useState<GenderTabs>(GenderTabs.MALE);
  const [ages, setAges] = useState<number[]>(defineDefaultRange(ageDefaults));
  const [weights, setWeights] = useState<number[]>(weightDefaults);
  const topRef = useRef<HTMLDivElement | null>(null);

  // Filtring logic
  const filteredTeams = useMemo(() => {
    const filteredByGender = teams.filter(
      (team) => team.gender === genderValue,
    );
    const filteredByAge = filteredByGender.filter(
      (team) =>
        team.ages[0] >= ages[0] && team.ages[team.ages.length - 1] <= ages[1],
    );
    const filteredByWeight = filteredByAge.filter(
      (team) =>
        team.weights[0] >= weights[0] &&
        team.weights[team.weights.length - 1] <= weights[1],
    );
    return selectedSportTypes.length
      ? filteredByWeight.filter((team) =>
          team.sportTypes.some((item) => selectedSportTypes.includes(item)),
        )
      : filteredByWeight;
  }, [teams, genderValue, ages, weights, selectedSportTypes]);

  const handleTabChange = useCallback((value: string) => {
    setGenderValue(value as GenderTabs);
  }, []);

  function scrollToTop(): void {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <CustomSection className="relative mt-7 bg-transparent" ref={topRef}>
      <ContentWraper>
        <BasicFilters
          tabValue={genderValue}
          handleTabChange={handleTabChange}
          ages={ages}
          setAges={setAges}
          weights={weights}
          setWeights={setWeights}
          weightRange={weightRange}
          ageRange={ageRange}
          weightDefaults={weightDefaults}
          ageDefaults={ageDefaults}
          dictionary={dictionary}
        />
        <FilterByType
          options={sportTypes}
          selected={selectedSportTypes}
          setSelected={setSelectedSportTypes}
        />
        {/* <p className="mb-5 mr-auto text-base text-background">
          {!!filteredTeams.length
            ? `Найдено: ${filteredTeams.length}`
            : 'Ничего не найдено'}
        </p> */}
        <BigCardsWithImageField
          cards={filteredTeams}
          type="team"
          scrollToTop={scrollToTop}
          lang={lang}
        />
      </ContentWraper>
    </CustomSection>
  );
}
