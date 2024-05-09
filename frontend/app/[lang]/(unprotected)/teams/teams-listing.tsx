'use client';

import React, { useState } from 'react';
import { FilterByType } from '../events/filter-by-type';
import { SportsTypes, sportsTypes } from '@/lib/constants';
import { CustomSection } from '@/components/custom-section';
import { Team } from '@/lib/definitions';
import { TeamsCards } from './teams-cards';

export function TeamsListing({ teams }: { teams: Team[] }) {
  const [selectedSportTypes, setSelectedSportTypes] = useState<SportsTypes[]>(
    [],
  );
  return (
    <>
      <CustomSection className="relative mt-7 bg-transparent">
        <FilterByType
          options={sportsTypes}
          selected={selectedSportTypes}
          setSelected={setSelectedSportTypes}
        />
        <TeamsCards />
      </CustomSection>
    </>
  );
}
