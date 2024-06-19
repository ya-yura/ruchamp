'use client';

import {
  TextCardColored,
  TextCardColoredProps,
} from '@/components/cards/text-card-colored';
import { H4, PersonDescriptionOnCard } from '@/components/text';
import { Separator } from '@/components/ui/separator';
import React, { useMemo, useState } from 'react';
import { ValueOption } from '@/app/[lang]/(unprotected)/team/[id]/page';
import { transformDate } from '@/lib/utils/date-and-time';
import { EventMatch } from '../../matches/matches-event';
import { MatchesEventTabs } from '../../matches/matches-events-tabs';
import { Locale } from '@/i18n.config';
import { CreateMatchDialog } from '@/components/dialogs/create-match';
import { EventStatistics } from '@/lib/definitions';

interface OwnerMainProps {
  token?: string;
  eventId: string;
  daysBeforeEvent: string;
  eventStatus: string;
  matches: EventMatch[];
  matchDates: ValueOption[];
  sportTypes: string[];
  eventStatistics: EventStatistics | null;
  lang: Locale;
}

export function OwnerMain({
  token,
  eventId,
  daysBeforeEvent,
  eventStatus,
  matches,
  matchDates,
  sportTypes,
  eventStatistics,
  lang,
}: OwnerMainProps) {
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
    <div className="flex w-full flex-col gap-9">
      <ColoredCards
        dayStatistics={eventStatistics?.today}
        daysBeforeEvent={daysBeforeEvent}
        eventStatus={eventStatus}
      />
      <TransparentCards totalStatistics={eventStatistics?.total} />
      <Separator className="bg-NeutralStroke3Rest" />
      <div className="flex w-full items-center justify-between">
        <h5 className="text-xl font-light tracking-tighter text-ColorsGrey26 md:text-[28px]">
          Календарь мероприятий
        </h5>
        <CreateMatchDialog
          token={token}
          eventId={eventId}
          sportTypes={sportTypes}
          lang={lang}
        />
      </div>
      {!!matches.length ? (
        <MatchesEventTabs
          eventId={eventId}
          matches={filteredMatches}
          matchDates={matchDates}
          value={selectedDate}
          handleTabChange={handleTabChange}
          isOwner={true}
          lang={lang}
        />
      ) : (
        <PersonDescriptionOnCard className="mb-5 mr-auto text-base text-background">
          Мероприятий пока что не создано
        </PersonDescriptionOnCard>
      )}
    </div>
  );
}

interface ColoredCardsProps {
  dayStatistics?: EventStatistics['today'];
  daysBeforeEvent: string;
  eventStatus: string;
}

function ColoredCards({
  dayStatistics,
  daysBeforeEvent,
  eventStatus,
}: ColoredCardsProps) {
  const totalTicketPrice = new Intl.NumberFormat('RU', {
    style: 'currency',
    currency: 'RUB',
  }).format(dayStatistics?.sold_tickets_price || 0);

  const textCardsData: TextCardColoredProps[] = [
    {
      title: `${dayStatistics?.teams || 0} команд`,
      text: 'Подали заявки на участие',
      className: 'bg-pistachio',
      titleStyles: 'text-ColorsGrey14 font-black',
      textStyles: 'text-ColorsGrey26',
    },
    {
      title: `${dayStatistics?.teams_payed || 0} команд`,
      text: 'Внесли платёж за участие',
      className: 'bg-orange',
      titleStyles: 'text-ColorsGrey14 font-black',
      textStyles: 'text-ColorsGrey26',
    },
    {
      title: `${dayStatistics?.tickets || 0} билетов`,
      text: `Продано на ${totalTicketPrice}`,
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
            key={card.text}
            title={card.title}
            text={card.text}
            className={card.className}
            titleStyles={card.titleStyles}
            textStyles={card.textStyles}
          />
        ))}
        <li className="flex flex-col gap-4">
          {eventStatus && (
            <h5 className="text-right text-2xl font-light tracking-tighter text-ColorsGrey26 md:text-left">
              {eventStatus}
            </h5>
          )}
          <h6 className="text-right text-4xl font-semibold text-ColorsGrey98 md:text-left">
            {daysBeforeEvent}
          </h6>
        </li>
      </ul>
    </div>
  );
}

function TransparentCards({
  totalStatistics,
}: {
  totalStatistics?: EventStatistics['total'];
}) {
  const totalTicketPrice = new Intl.NumberFormat('RU', {
    style: 'currency',
    currency: 'RUB',
  }).format(totalStatistics?.sold_tickets_price || 0);
  const totalGain = new Intl.NumberFormat('RU', {
    style: 'currency',
    currency: 'RUB',
  }).format(totalStatistics?.total_gain || 0);

  const transparentCardsData: TransparentCardProps[] = [
    {
      title: 'В мероприятии участвуют:',
      text: `${totalStatistics?.teams || 0} команд`,
      spanText: '(* человек)',
      redFlagText: 'Нет отклоненных заявок',
    },
    {
      title: 'Зрителями будут:',
      text: `${totalStatistics?.tickets || 0} человек`,
      redFlagText: 'Нет возвратов по билетам',
    },
    {
      title: 'Собрано взносов:',
      text: totalTicketPrice,
    },
    {
      title: 'Продано билетов на:',
      text: totalGain,
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
      <p className="mb-5 text-xl font-light tracking-tighter text-ColorsGrey26 md:text-[28px]">
        {title}
      </p>
      <p className="mb-2 text-2xl font-semibold tracking-tighter text-ColorsGrey98 md:text-[36px]">
        {text}{' '}
        <span className="font-light text-neutralForeground3Rest">
          {spanText}
        </span>
      </p>
      <p className="text-sm tracking-tighter text-darkRed md:text-base">
        {redFlagText}
      </p>
    </li>
  );
}
