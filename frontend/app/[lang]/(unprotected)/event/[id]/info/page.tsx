import { TextCard } from '@/components/cards/text-card';
import { TextCardFieldWithTwoLists } from '@/components/cards/text-card-field-with-two-lists';
import { Container } from '@/components/container';
import { ContentWraper } from '@/components/content-wraper';
import { CustomSection } from '@/components/custom-section';
import { H4 } from '@/components/text';
import { Locale } from '@/i18n.config';
import { getSession } from '@/lib/actions/auth';
import { fetchEvent } from '@/lib/data';
import { UserInfo } from '@/lib/definitions';
import { transformDate } from '@/lib/utils/date-and-time';
import { path } from '@/lib/utils/other-utils';
import { redirect } from 'next/navigation';
import React, { Suspense } from 'react';
import Loading from './loading';
import { Event } from '@/lib/definitions';
import Link from 'next/link';
import Image from 'next/image';

export default async function EventInfoPage({
  params,
}: {
  params: { id: string; lang: Locale };
}) {
  const { id, lang } = params;
  const [session, event] = await Promise.all([getSession(), fetchEvent(id)]);
  const user: UserInfo | null = session
    ? {
        basicInfo: session.user[1],
        roleInfo: session.user[0],
      }
    : null;
  const isOwner = user?.roleInfo.id === event?.organizer_id;

  if (!event) {
    return (
      <Container>
        <H4 className="relative">Такого события не найдено</H4>
      </Container>
    );
  }

  const eventStartTime = transformDate(event.start_datetime, true);
  const applicationTime = `${transformDate(event.end_request_datetime, true).replace(/ /g, '\u00A0')} – ${transformDate(event.end_request_datetime, true).replace(/ /g, '\u00A0')}`;

  return (
    <Suspense fallback={<Loading />}>
      <TextCardFieldWithTwoLists
        ariaLabelledby="info"
        firstList={<MainEventInfo description={event.description} />}
        secondList={
          <DateAndOrganizer
            eventStartTime={eventStartTime}
            applicationTime={applicationTime}
            organizer={event}
          />
        }
      />
    </Suspense>
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
  organizer: Event;
}

function DateAndOrganizer({
  eventStartTime,
  applicationTime,
  organizer,
}: DateAndOrganizerProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const hasEventOrder = organizer.event_order.startsWith('static');
  const hasEventSystem = organizer.event_system.startsWith('static');
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
        title={organizer.organizer_name}
        text={'Организатор'}
      >
        <div className='flex'>        
          <p className='whitespace-pre-line text-sm text-text-mutedCard'>Телефон:&nbsp;</p>
          <Link className='text-sm text-white transition-colors hover:text-neutral-400' href={`tel:${organizer.contact_phone}`}>
            {organizer.contact_phone}
          </Link>
        </div>
        <div className='flex max-w-full'>        
          <p className='whitespace-pre-line text-sm text-text-mutedCard'>Email:&nbsp;</p>
          <Link href={`mailto:${organizer.contact_email}`} passHref legacyBehavior>
          <a className='text-sm transition-colors inline-block max-w-[85%] whitespace-nowrap overflow-hidden text-white text-ellipsis  hover:text-neutral-400' 
            title={organizer.contact_email}>
              {organizer.contact_email}
          </a>
          </Link>
        </div>
        <div className='flex mb-3'>        
          <p className='whitespace-pre-line text-sm text-text-mutedCard'>Website:&nbsp;</p>
          <Link href={organizer.website.startsWith('http') ? organizer.website : `http://${organizer.website}`} passHref legacyBehavior>
            <a className='text-sm text-white transition-colors hover:text-neutral-400' target="_blank">{organizer.website}</a>
          </Link>
        </div>
      </TextCard>
      {(hasEventOrder || hasEventSystem) && ( 
        <TextCard
          className="bg-card-backgroundDark"
          text={'Документы'}
        >
          {hasEventSystem && ( 
            <Link href={`${baseUrl}/${organizer.event_system}`} passHref legacyBehavior>
              <a className='text-sm text-white transition-colors hover:text-neutral-400' target="_blank">Регламент проведения</a>
            </Link>
          )}
          {hasEventOrder && ( 
            <Link href={`${baseUrl}/${organizer.event_order}`} passHref legacyBehavior>
              <a className='text-sm text-white transition-colors hover:text-neutral-400 mb-3' target="_blank">Отчет судьи</a>
            </Link>
          )}
        </TextCard>
      )}
    </>
  );
}
