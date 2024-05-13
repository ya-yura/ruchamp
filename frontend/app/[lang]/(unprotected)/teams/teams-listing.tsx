'use client';

import React, { useRef, useState } from 'react';
import { FilterByType } from '../events/filter-by-type';
import { sportTypes } from '@/lib/constants';
import { CustomSection } from '@/components/custom-section';
import { ContentWraper } from '@/components/content-wraper';
import { BigCardsWithImageField } from '@/components/cards/big-cards-with-image-field';
import { Locale } from '@/i18n.config';
import { Team } from './page';

export function TeamsListing({ teams, lang }: { teams: Team[]; lang: Locale }) {
  const [selectedSportTypes, setSelectedSportTypes] = useState<string[]>([]);
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
            options={sportTypes}
            selected={selectedSportTypes}
            setSelected={setSelectedSportTypes}
          />

          <p className="mb-5 mr-auto text-base text-background">
            {teams.length > 1
              ? `Найдено: ${teams.length}`
              : 'Ничего не найдено'}
          </p>
          <BigCardsWithImageField
            cards={teams}
            type="team"
            scrollToTop={scrollToTop}
            lang={lang}
          />
        </ContentWraper>
      </CustomSection>
    </>
  );
}
