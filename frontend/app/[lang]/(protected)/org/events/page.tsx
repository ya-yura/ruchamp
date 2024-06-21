import React, { Suspense } from 'react';
import Loading from './loading';
import { Container } from '@/components/container';
import { EventsTabs } from '@/app/[lang]/(unprotected)/events/events-tabs';
import { getDictionary } from '@/lib/dictionary';
import { fetchOrgEvents, fetchSportTypes } from '@/lib/data';
import { divideEventsByDateTime } from '@/lib/utils/date-and-time';
import { sortedEventsByDate } from '@/lib/utils/filters';
import { Locale } from '@/i18n.config';
import { getSession } from '@/lib/actions/auth';
import { Event } from '@/lib/definitions';

export default async function OrgEventsPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const { page } = await getDictionary(lang);
  const session = await getSession();
  const token = session?.token;

  const [orgEvents, sportTypes] = await Promise.all([
    fetchOrgEvents(token),
    fetchSportTypes(),
  ]);
  const dictionary = page.events;

  if (orgEvents === null) {
    return (
      <Container>
        <Suspense fallback={<Loading />}>
          <EventsTabs
            dictionary={dictionary}
            lang={lang}
            sportTypes={sportTypes}
            futureEvents={[]}
            pastEvents={[]}
            isOrg={true}
            token={token}
            errorText={'Произошла ошибка при загрузке событий'}
          />
        </Suspense>
      </Container>
    );
  }

  const { futureEvents, pastEvents } = divideEventsByDateTime<Event>(orgEvents);
  const sortedFutureEvents = sortedEventsByDate(futureEvents);
  const sortedPastEvents = sortedEventsByDate(pastEvents, 'past');

  return (
    <Container>
      <Suspense fallback={<Loading />}>
        <EventsTabs
          dictionary={dictionary}
          lang={lang}
          sportTypes={sportTypes}
          futureEvents={sortedFutureEvents}
          pastEvents={sortedPastEvents}
          isOrg={true}
          token={token}
        />
      </Suspense>
    </Container>
  );
}
