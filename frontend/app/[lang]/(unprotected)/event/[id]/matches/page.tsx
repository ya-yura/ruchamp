import React from 'react';
import { MatchesEvent } from '../matches-event';
import { fetchEvent, fetchMatches } from '@/lib/data';
import { Locale } from '@/i18n.config';
import { ValueOption } from '../../../team/[id]/page';
import { transformDate } from '@/lib/utils/date-and-time';
import { filterUniqueDisplayedValues } from '@/lib/utils/other-utils';
import { CustomSection } from '@/components/custom-section';

export default async function EventMatchesPage({
  params,
}: {
  params: { id: string; lang: Locale };
}) {
  const { id, lang } = params;
  const [event, matches] = await Promise.all([
    fetchEvent(id),
    fetchMatches(id),
  ]);
  const allMatchDates: ValueOption[] = matches
    .map((match) => ({
      value: match?.start_datetime || '',
      displayedValue: transformDate(match?.start_datetime) || '',
    }))
    .sort((a: ValueOption, b: ValueOption) => {
      if (a.value < b.value) return -1;
      if (a.value > b.value) return 1;
      return 0;
    });

  const matchDates = filterUniqueDisplayedValues(allMatchDates);

  const regStart: ValueOption = {
    value: event?.start_request_datetime || '',
    displayedValue: transformDate(event?.start_request_datetime || ''),
  };
  const regEnd: ValueOption = {
    value: event?.end_request_datetime || '',
    displayedValue: transformDate(event?.end_request_datetime || ''),
  };
  const matchesStart: ValueOption = {
    value: matchDates[0]?.value || '',
    displayedValue: transformDate((matchDates[0]?.value as string) || ''),
  };
  const matchesEnd: ValueOption = {
    value: matchDates[matchDates.length - 1]?.value || '',
    displayedValue: transformDate(
      (matchDates[matchDates.length - 1]?.value as string) || '',
    ),
  };
  const awardingTime: ValueOption = matchesEnd;
  return (
    <CustomSection className="relative mb-10">
      <MatchesEvent
        eventId={id}
        matches={matches}
        matchDates={matchDates}
        regStart={regStart}
        regEnd={regEnd}
        matchesStart={matchesStart}
        matchesEnd={matchesEnd}
        awardingTime={awardingTime}
        lang={lang}
      />
    </CustomSection>
  );
}
