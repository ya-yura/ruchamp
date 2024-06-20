'use client';

import { ContentWraper } from '@/components/content-wraper';
import { CustomSection } from '@/components/custom-section';
import React, { useMemo, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Locale } from '@/i18n.config';
import { AthleteMatch } from '@/lib/definitions';
import { cn } from '@/lib/utils';
import {
  divideEventsByDateTime,
  transformDate,
} from '@/lib/utils/date-and-time';
import { H5 } from '@/components/text';
import { Tag } from '@/components/tag';
import { CustomLink } from '@/components/custom-link';

interface ProfileMatchesProps {
  matches: AthleteMatch[];
  tabsData: Record<string, string>;
  lang: Locale;
}

export function ProfileMatches({
  matches,
  tabsData,
  lang,
}: ProfileMatchesProps) {
  const [selectedTab, setSelectedTab] = useState<string>(
    Object.keys(tabsData)[0],
  );

  const filteredMatches = useMemo(() => {
    const { futureEvents, pastEvents } =
      divideEventsByDateTime<AthleteMatch>(matches);
    if (selectedTab === 'past') return pastEvents;
    if (selectedTab === 'upcoming') return futureEvents;
    return [];
  }, [selectedTab, matches]);

  function handleTabChange(value: string): void {
    setSelectedTab(value);
  }

  return (
    <CustomSection className="relative pt-[76px]">
      <ContentWraper className="min-h-44">
        <h5 className="text-xl font-light tracking-tighter text-ColorsGrey26 md:text-[28px] mb-10">
          Мои мероприятия
        </h5>
        <Tabs
          defaultValue={Object.keys(tabsData)[0]}
          className="w-full"
          onValueChange={handleTabChange}
          value={selectedTab}
        >
          <TabsList className="flex w-fit justify-between bg-transparent text-text-mutedLight">
            {Object.entries(tabsData).map(([key, value]) => (
              <TabsTrigger
                key={key}
                className={cn(
                  'group',
                  'first-of-type:ml-4 last-of-type:mr-4',
                  'sm:first-of-type:ml-0 sm:last-of-type:mr-0',
                )}
                value={key}
              >
                <div className='mr-2 h-5 w-5 bg-[url("/images/icons/calendar.svg")] group-data-[state=active]:bg-[url("/images/icons/calendar-filled.svg")]'></div>
                {value}
              </TabsTrigger>
            ))}
          </TabsList>
          {Object.entries(tabsData).map(([key, value]) => (
            <TabsContent className="mt-0" key={key} value={key}>
              <ProfileMatchesField matches={filteredMatches} lang={lang} />
            </TabsContent>
          ))}
        </Tabs>
      </ContentWraper>
    </CustomSection>
  );
}

interface ProfileMatchesFieldPops {
  matches: AthleteMatch[];
  lang: Locale;
}

function ProfileMatchesField({ matches, lang }: ProfileMatchesFieldPops) {
  return (
    <div className="rounded-lg bg-black px-2 pb-2 pt-4">
      <p className="mb-4 mr-auto text-base text-background">
        {!!matches.length
          ? `Всего мероприятий в этом разделе: ${matches.length}`
          : 'В этом разделе не найдено мероприятий'}
      </p>
      <ul className="flex flex-col gap-3 ">
        {matches.map((match) => (
          <ProfileMatchCard
            key={match.match_id}
            eventId={match.event_id}
            matchId={match.match_id}
            startTime={match.start_datetime}
            sportType={match.sport_name}
            grade={match.category_type}
            gender={match.gender}
            weightClass={match.weight_category}
            weightMin={match.weight_min}
            weightMax={match.weight_max}
            ageMin={match.age_min}
            ageMax={match.age_max}
            result={match.athlete_result}
            buttonText={'Турнирная сетка'}
            lang={lang}
          />
        ))}
      </ul>
    </div>
  );
}

export interface ProfileMatchCardProps {
  name?: string;
  eventId: string | number;
  matchId: number;
  startTime: string;
  sportType: string;
  grade: string;
  gender?: boolean;
  weightClass: string;
  weightMin: number;
  weightMax: number;
  buttonText?: string;
  ageMin: number;
  ageMax: number;
  result: string;
  lang: Locale;
}

export function ProfileMatchCard({
  name,
  eventId,
  matchId,
  startTime,
  sportType,
  grade,
  gender,
  weightClass,
  weightMin,
  weightMax,
  buttonText,
  ageMin,
  ageMax,
  result,
  lang,
}: ProfileMatchCardProps) {
  return (
    <li className="flex cursor-default flex-col gap-3 rounded-lg bg-card-background px-4 py-4">
      <div className="flex gap-7">
        <H5 className="whitespace-nowrap text-xl font-semibold text-white">
          {transformDate(startTime)}
        </H5>
        <H5 className="truncate text-xl font-normal text-neutralForeground3Rest">
          {sportType}
        </H5>
      </div>
      <div className="flex flex-col justify-between gap-5 md:flex-row">
        <div className="flex flex-wrap gap-2">
          <Tag variant={'transparentAccentBorder'}>
            {gender !== undefined ? (gender ? 'Муж' : 'Жен') : 'Пол не указан'}
          </Tag>
          {ageMax !== 0 && (
            <Tag variant={'transparentGrayBorder'}>
              {ageMin} – {ageMax} лет
            </Tag>
          )}
          {weightClass && (
            <Tag variant={'transparentGrayBorder'}>
              {weightClass}: от {weightMin} кг до {weightMax} кг
            </Tag>
          )}
          {grade && <Tag variant={'transparentGrayBorder'}>{grade}</Tag>}
        </div>
        {buttonText && (
          <CustomLink
            className={cn(
              'h-10 bg-primary-mainAccent px-4 py-2 text-base font-semibold text-primary-foreground hover:bg-primary-mainAccent/90',
              'inline-flex items-center justify-center whitespace-nowrap rounded-md ring-offset-background',
              'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            )}
            lang={lang}
            href={`/event/${eventId}/matches/${matchId}`}
          >
            {buttonText}
          </CustomLink>
        )}
      </div>
    </li>
  );
}
