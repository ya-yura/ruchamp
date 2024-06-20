import { BigCardWithImage } from '@/components/cards/big-card-with-image';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Locale } from '@/i18n.config';
import { transformDate } from '@/lib/utils/date-and-time';
import { BigCardWithImageAthlete } from './big-card-with-image-athlete';

interface Card {
  type: string;
  id: number;
  name: string;
  date: string;
  location: string;
  lang: Locale;
  className?: string;

}

interface BigCardsWithImageFieldAthleteProps {
  cards: Card[];
  type: 'event';
  lang: Locale;
}

export function BigCardsWithImageFieldAthlete({
  cards,
  type,
  lang,
}: BigCardsWithImageFieldAthleteProps) {

  return (
    <>
      <ul className="mb-10 flex gap-4">
        {cards.map((card) => (
          <BigCardWithImageAthlete
            key={card.id}
            type={type}
            id={card.id}
            name={card.name}
            date={card.date}
            location={card.location}
            lang={lang}
          />
        ))}
      </ul>

    </>
  );
}
