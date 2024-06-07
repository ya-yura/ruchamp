'use client';

import { ContentWraper } from '@/components/content-wraper';
import { useMemo, useState } from 'react';
import { ValueOption } from '../../team/[id]/page';
import { MatchesEventTabs } from './matches-events-tabs';
import { EventTiming } from './event-timing';
import { transformDate } from '@/lib/utils/date-and-time';
import { PersonDescriptionOnCard } from '@/components/text';
import { Locale } from '@/i18n.config';

export interface EventMatch {
  id: number;
  name: string;
  start_datetime: string;
  end_datetime: string;
  sport_name: string;
  age_min: number;
  age_max: number;
  gender: boolean;
  weight_category: string;
  category_type: string;
}

interface MatchesEventProps {
  eventId: string;
  matches: EventMatch[];
  matchDates: ValueOption[];
  regStart: ValueOption;
  regEnd: ValueOption;
  matchesStart: ValueOption;
  matchesEnd: ValueOption;
  awardingTime: ValueOption;
  lang: Locale;
}

export function MatchesEvent({
  eventId,
  matches,
  matchDates,
  regStart,
  regEnd,
  matchesStart,
  matchesEnd,
  awardingTime,
  lang,
}: MatchesEventProps) {
  const [selectedDate, setSelectedDate] = useState<string>(
    matchDates[0]?.displayedValue || '',
  );

  const filteredMatches = useMemo(() => {
    return matches.filter(
      (match) => transformDate(match.start_datetime) === selectedDate,
    );
  }, [selectedDate, matches]);

  function handleTabChange(value: string): void {
    setSelectedDate(value);
  }

  return (
    <ContentWraper className="min-h-44 gap-16">
      {!!matches.length ? (
        <>
          <EventTiming
            regStart={regStart}
            regEnd={regEnd}
            matchesStart={matchesStart}
            matchesEnd={matchesEnd}
            awardingTime={awardingTime}
          />
          <MatchesEventTabs
            eventId={eventId}
            matches={filteredMatches}
            matchDates={matchDates}
            value={selectedDate}
            handleTabChange={handleTabChange}
            lang={lang}
          />
        </>
      ) : (
        <PersonDescriptionOnCard className="mb-5 mr-auto text-base text-background">
          Мероприятий пока что не создано
        </PersonDescriptionOnCard>
      )}
    </ContentWraper>
  );
}
