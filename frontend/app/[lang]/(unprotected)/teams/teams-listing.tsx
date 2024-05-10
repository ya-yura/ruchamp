'use client';

import React, { useRef, useState } from 'react';
import { FilterByType } from '../events/filter-by-type';
import { SportsTypes, sportsTypes } from '@/lib/constants';
import { CustomSection } from '@/components/custom-section';
import { Team } from '@/lib/definitions';
import { TeamsCards } from './teams-cards';
import { ContentWraper } from '@/components/content-wraper';

export function TeamsListing({ teams }: { teams: Team[] }) {
  const [selectedSportTypes, setSelectedSportTypes] = useState<SportsTypes[]>(
    [],
  );
  const topRef = useRef<HTMLDivElement | null>(null);

  function scrollToTop(): void {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }
  return (
    <>
      <CustomSection className="relative mt-7 bg-transparent" ref={topRef}>
        <ContentWraper>
          <FilterByType
            options={sportsTypes}
            selected={selectedSportTypes}
            setSelected={setSelectedSportTypes}
          />
        </ContentWraper>

        <TeamsCards
          teams={teams}
          selectedSportTypes={selectedSportTypes}
          scrollToTop={scrollToTop}
        />
      </CustomSection>
    </>
  );
}
