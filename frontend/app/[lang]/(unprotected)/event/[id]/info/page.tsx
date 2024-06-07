import { TextCard } from '@/components/cards/text-card';
import { TextCardFieldWithTwoLists } from '@/components/cards/text-card-field-with-two-lists';
import { Container } from '@/components/container';
import { ContentWraper } from '@/components/content-wraper';
import { CustomSection } from '@/components/custom-section';
import { H4 } from '@/components/text';
import { Locale } from '@/i18n.config';
import { getSession } from '@/lib/actions/auth';
import { fetchEvent } from '@/lib/data';
import { transformDate } from '@/lib/utils/date-and-time';
import React from 'react';

export default async function EventInfoPage({
  params,
}: {
  params: { id: string; lang: Locale };
}) {
  const { id, lang } = params;
  const [session, event] = await Promise.all([getSession(), fetchEvent(id)]);

  if (!event) {
    return (
      <Container>
        <H4 className="relative">Такого события не найдено</H4>
      </Container>
    );
  }

  const eventStartTime = transformDate(event.start_datetime, true);
  const applicationTime = `${transformDate(event.end_request_datetime)} – ${transformDate(event.end_request_datetime)}`;

  return (
    <CustomSection className="relative mb-10">
      <ContentWraper>
        <TextCardFieldWithTwoLists
          ariaLabelledby="info"
          firstList={<MainEventInfo description={event.description} />}
          secondList={
            <DateAndOrganizer
              eventStartTime={eventStartTime}
              applicationTime={applicationTime}
              organizer={event.organizer_name}
            />
          }
        />
      </ContentWraper>
    </CustomSection>
  );
}

function MainEventInfo({ description }: { description: string }) {
  return (
    <>
      <TextCard title={'Описание'} text={description} />
    </>
  );
}

interface DateAndOrganizerProps {
  eventStartTime: string;
  applicationTime: string;
  organizer: string;
}

function DateAndOrganizer({
  eventStartTime,
  applicationTime,
  organizer,
}: DateAndOrganizerProps) {
  return (
    <>
      <TextCard
        className="bg-card-backgroundDark"
        title={eventStartTime}
        text={'Начало мероприятия'}
      />
      <TextCard
        className="bg-card-backgroundDark"
        title={applicationTime}
        text={'Приём заявок'}
      />
      <TextCard
        className="bg-card-backgroundDark"
        title={organizer}
        text={'Организатор'}
      />
    </>
  );
}
