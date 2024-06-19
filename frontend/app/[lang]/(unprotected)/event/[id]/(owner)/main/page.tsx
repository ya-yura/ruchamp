import React from 'react';
import { Locale } from '@/i18n.config';
import { getSession } from '@/lib/actions/auth';
import {
  fetchEvent,
  fetchEventStatistics,
  fetchMatches,
  fetchSportTypes,
} from '@/lib/data';
import { OwnerMain } from './owner-main';
import { CustomSection } from '@/components/custom-section';
import { ContentWraper } from '@/components/content-wraper';
import { filterUniqueDisplayedValues } from '@/lib/utils/other-utils';
import { ValueOption } from '../../../../team/[id]/page';
import {
  calculateDaysBefore,
  getEventStatus,
  transformDate,
} from '@/lib/utils/date-and-time';
import { isToday } from 'date-fns';

export default async function EventMainPage({
  params,
}: {
  params: { id: string; lang: Locale };
}) {
  const { id, lang } = params;
  const [session, event, matches, sportTypes] = await Promise.all([
    getSession(),
    fetchEvent(id),
    fetchMatches(id),
    fetchSportTypes(),
  ]);
  const token = session?.token;
  const eventStatistics = await fetchEventStatistics(token, id);
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
  const daysBeforeEvent = calculateDaysBefore(
    event?.start_datetime,
    new Date(),
  );
  const eventStatus = isToday(event?.start_datetime || new Date())
    ? ''
    : getEventStatus(event?.start_datetime, new Date());

  return (
    <CustomSection className="relative bg-transparent">
      <ContentWraper className="items-start gap-6 pb-10">
        <OwnerMain
          token={token}
          eventId={id}
          daysBeforeEvent={daysBeforeEvent}
          eventStatus={eventStatus}
          matches={matches}
          matchDates={matchDates}
          sportTypes={sportTypes}
          eventStatistics={eventStatistics}
          lang={lang}
        />
      </ContentWraper>
    </CustomSection>
  );
}
