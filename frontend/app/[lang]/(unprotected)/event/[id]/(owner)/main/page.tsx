import React from 'react';
import { Locale } from '@/i18n.config';
import { getSession } from '@/lib/actions/auth';
import { fetchEvent, fetchMatches } from '@/lib/data';
import { OwnerMain } from './owner-main';
import { CustomSection } from '@/components/custom-section';
import { ContentWraper } from '@/components/content-wraper';
import { filterUniqueDisplayedValues, path } from '@/lib/utils/other-utils';
import { ValueOption } from '../../../../team/[id]/page';
import { transformDate } from '@/lib/utils/date-and-time';

export default async function EventMainPage({
  params,
}: {
  params: { id: string; lang: Locale };
}) {
  const { id, lang } = params;
  const [session, event, matches] = await Promise.all([
    getSession(),
    fetchEvent(id),
    fetchMatches(id),
  ]);
  const token = session?.token;
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

  return (
    <CustomSection className="relative bg-transparent">
      <ContentWraper className="items-start gap-6 pb-10">
        <OwnerMain
          token={token}
          eventId={id}
          matches={matches}
          matchDates={matchDates}
          lang={lang}
        />
      </ContentWraper>
    </CustomSection>
  );
}
