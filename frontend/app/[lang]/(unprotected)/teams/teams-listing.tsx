'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FilterByType } from '../events/filter-by-type';
import { sportTypes } from '@/lib/constants';
import { CustomSection } from '@/components/custom-section';
import { ContentWraper } from '@/components/content-wraper';
import { BigCardsWithImageField } from '@/components/cards/big-cards-with-image-field';
import { Locale } from '@/i18n.config';
import { Team } from './page';
import { BasicFilters } from './basic-filters';
import { Dictionary } from '../../dictionary-provider';

export enum GenderTabs {
  MALE = 'male',
  FEMALE = 'female',
  MIXED = 'mixed',
}

interface TeamsListingProps {
  teams: Team[];
  lang: Locale;
  dictionary: Dictionary['page']['teams'];
}

export function TeamsListing({ teams, lang, dictionary }: TeamsListingProps) {
  const [selectedSportTypes, setSelectedSportTypes] = useState<string[]>([]);
  const [genderValue, setGenderValue] = useState<GenderTabs>(GenderTabs.MALE);
  const [ages, setAges] = useState<number[]>([18, 30]); //don't forget to change default in RangeSlider props
  const [weights, setWeights] = useState<number[]>([50, 90]); //don't forget to change default in RangeSlider props
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const topRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const filtredByGender = teams.filter((team) => team.gender === genderValue);
    const filtredByAge = filtredByGender.filter(
      (team) =>
        team.ages[0] >= ages[0] && team.ages[team.ages.length - 1] <= ages[1],
    );
    const filtredByWeight = filtredByAge.filter(
      (team) =>
        team.weights[0] >= weights[0] &&
        team.weights[team.weights.length - 1] <= weights[1],
    );
    const filtredByType = !!selectedSportTypes.length
      ? filtredByWeight.filter((team) =>
          team.sportTypes.some((item) => selectedSportTypes.includes(item)),
        )
      : filtredByWeight;
    setFilteredTeams(filtredByType);
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
          dictionary={dictionary}
        />
        <FilterByType
          options={sportTypes}
          selected={selectedSportTypes}
          setSelected={setSelectedSportTypes}
        />

        <p className="mb-5 mr-auto text-base text-background">
          {filteredTeams.length > 1
            ? `Найдено: ${filteredTeams.length}`
            : 'Ничего не найдено'}
        </p>
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
