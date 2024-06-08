'use client';

import {
  TextCardColored,
  TextCardColoredProps,
} from '@/components/cards/text-card-colored';
import { H4, PersonDescriptionOnCard } from '@/components/text';
import { Separator } from '@/components/ui/separator';
import React, { useMemo, useState } from 'react';
import { MatchesEventTabs } from './matches/matches-events-tabs';
import { ValueOption } from '../../team/[id]/page';
import { transformDate } from '@/lib/utils/date-and-time';
import { Button } from '@/components/ui/button';
import { EventMatch } from './matches/matches-event';

interface OwnerMainProps {
  matches: EventMatch[];
  matchDates: ValueOption[];
}

export function OwnerMain({ matches, matchDates }: OwnerMainProps) {
  const [selectedDate, setSelectedDate] = useState<string>(
    matchDates[0]?.displayedValue || '',
  );

  const filteredMatches = useMemo(() => {
    return !!matches.length
      ? matches.filter(
          (match) => transformDate(match.start_datetime) === selectedDate,
        )
      : [];
  }, [selectedDate, matches]);

  function handleTabChange(value: string): void {
    setSelectedDate(value);
  }
  return (
    <div className="flex flex-col gap-9">
      <ColoredCards />
      <TransparentCards />
      <Separator className="bg-NeutralStroke3Rest" />
      <div className="flex w-full items-center justify-between">
        <h5 className="text-ColorsGrey26 text-xl font-light tracking-tighter md:text-[28px]">
          Календарь мероприятий
        </h5>
        <Button variant={'ruchampDefault'} type="button">
          Добавить мероприятие
        </Button>
      </div>
      {!!matches.length ? (
        <MatchesEventTabs
          eventId={'1'}
          matches={filteredMatches}
          matchDates={matchDates}
          value={selectedDate}
          handleTabChange={handleTabChange}
          isOwner={true}
          lang={'ru'} //fix later
        />
      ) : (
        <PersonDescriptionOnCard className="mb-5 mr-auto text-base text-background">
          Мероприятий пока что не создано
        </PersonDescriptionOnCard>
      )}
    </div>
  );
}

function ColoredCards() {
  const textCardsData: TextCardColoredProps[] = [
    {
      title: '11 команд',
      text: 'Подали заявки на участие',
      className: 'bg-pistachio',
      titleStyles: 'text-ColorsGrey14 font-black',
      textStyles: 'text-ColorsGrey26',
    },
    {
      title: '83 команды',
      text: 'Внесли платёж за участие',
      className: 'bg-orange',
      titleStyles: 'text-ColorsGrey14 font-black',
      textStyles: 'text-ColorsGrey26',
    },
    {
      title: '111 билетов',
      text: 'Продано на 10 000 ₽',
      className: 'bg-purple',
      titleStyles: 'text-ColorsGrey98 font-black',
      textStyles: 'text-ColorsGrey98',
    },
  ];

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-black px-6 py-7">
      <H4>Статистика за сегодня</H4>
      <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {textCardsData.map((card) => (
          <TextCardColored
            key={card.title}
            title={card.title}
            text={card.text}
            className={card.className}
            titleStyles={card.titleStyles}
            textStyles={card.textStyles}
          />
        ))}
        <li className="flex flex-col gap-4">
          <h5 className="text-ColorsGrey26 text-right text-2xl font-light tracking-tighter md:text-left">
            До начала осталось:
          </h5>
          <h6 className="text-ColorsGrey98 text-right text-4xl font-semibold md:text-left">
            33 дня
          </h6>
        </li>
      </ul>
    </div>
  );
}

function TransparentCards() {
  const transparentCardsData: TransparentCardProps[] = [
    {
      title: 'В мероприятии участвуют:',
      text: '99 команд',
      spanText: '(289 человек)',
      redFlagText: 'Заявки 33 команд отклонены',
    },
    {
      title: 'Зрителями будут:',
      text: '358 человек',
      redFlagText: '12 человек вернули билеты',
    },
    {
      title: 'Собрано взносов:',
      text: '790 000 ₽',
    },
    {
      title: 'Продано билетов на:',
      text: '110 000 ₽',
    },
  ];

  return (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-10">
      {transparentCardsData.map((card, index) => (
        <TransparentCard
          key={index}
          title={card.title}
          text={card.text}
          spanText={card.spanText}
          redFlagText={card.redFlagText}
        />
      ))}
    </ul>
  );
}

interface TransparentCardProps {
  title: string;
  text: string;
  spanText?: string;
  redFlagText?: string;
}

function TransparentCard({
  title,
  text,
  spanText,
  redFlagText,
}: TransparentCardProps) {
  return (
    <li className="flex flex-col">
      <p className="text-ColorsGrey26 mb-5 text-xl font-light tracking-tighter md:text-[28px]">
        {title}
      </p>
      <p className="text-ColorsGrey98 mb-2 text-2xl font-semibold tracking-tighter md:text-[36px]">
        {text}{' '}
        <span className="font-light text-neutralForeground3Rest">
          {spanText}
        </span>
      </p>
      <p className="text-darkRed text-sm tracking-tighter md:text-base">
        {redFlagText}
      </p>
    </li>
  );
}
