'use client';

import { ContentWraper } from '@/components/content-wraper';
import { EventMatch } from './page';
import { useMemo, useState } from 'react';
import { ValueOption } from '../../team/[id]/page';
import { MatchesEventTabs } from './matches-events-tabs';
import { EventTiming } from './event-timing';
import { transformDate } from '@/lib/utils/date-and-time';

interface MatchesEventProps {
  matches: EventMatch[];
  matchDates: ValueOption[];
  regStart: ValueOption;
  regEnd: ValueOption;
  matchesStart: ValueOption;
  matchesEnd: ValueOption;
  awardingTime: ValueOption;
}

export function MatchesEvent({
  matches,
  matchDates,
  regStart,
  regEnd,
  matchesStart,
  matchesEnd,
  awardingTime,
}: MatchesEventProps) {
  const [selectedDate, setSelectedDate] = useState<string>(
    matchDates[0].displayedValue,
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
      <EventTiming
        regStart={regStart}
        regEnd={regEnd}
        matchesStart={matchesStart}
        matchesEnd={matchesEnd}
        awardingTime={awardingTime}
      />
      <MatchesEventTabs
        matches={filteredMatches}
        matchDates={matchDates}
        value={selectedDate}
        handleTabChange={handleTabChange}
      />
    </ContentWraper>
  );
}
