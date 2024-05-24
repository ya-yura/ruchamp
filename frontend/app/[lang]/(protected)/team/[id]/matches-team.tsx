'use client';

import { BigCardsWithImageField } from '@/components/cards/big-cards-with-image-field';
import { ContentWraper } from '@/components/content-wraper';
import { Locale } from '@/i18n.config';
import { useRef } from 'react';

interface MatchesTeamProps {
  lang: Locale;
}

export function MatchesTeam({ lang }: MatchesTeamProps) {
  const topRef = useRef<HTMLDivElement | null>(null);

  function scrollToTop(): void {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }
  return (
    <ContentWraper>
      <p className="mb-5 mr-auto text-base text-background">
        {!![].length ? `Найдено: ${[].length}` : 'Ничего не найдено'}
      </p>
      <BigCardsWithImageField
        cards={[]}
        type="team"
        scrollToTop={scrollToTop}
        lang={lang}
      />
    </ContentWraper>
  );
}
