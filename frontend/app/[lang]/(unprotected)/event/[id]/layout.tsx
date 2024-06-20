import '@/app/[lang]/ui/global.css';
import { Locale } from '@/i18n.config';
import { getSession } from '@/lib/actions/auth';
import { Container } from '@/components/container';
import { AddressSection } from './address-section';
import { ExpectedEvents } from './expected-events';
import { fetchEvent, fetchEvents } from '@/lib/data';
import { H4 } from '@/components/text';
import { getRandomInt } from '@/lib/utils/math-utils';
import { getExpectedEvents } from '@/lib/utils/other-utils';
import { Hero } from './hero';
import { EventActionButtons } from './event-action-buttons';
import { UserInfo } from '@/lib/definitions';

export default async function EventPageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string; lang: Locale };
}) {
  const { id, lang } = params;
  const [session, event, events] = await Promise.all([
    getSession(),
    fetchEvent(id),
    fetchEvents(),
  ]);
  const user: UserInfo | null = session
    ? {
        basicInfo: session.user[1],
        roleInfo: session.user[0],
      }
    : null;
  const isOwner = user?.roleInfo.id === event?.organizer_id;
  const randomInt = getRandomInt(100);
  const expectedEvents = getExpectedEvents(events, randomInt, 16);

  const tabsData: Record<string, string> = isOwner
    ? {
        info: 'Информация',
        main: 'Главное',
        teams: 'Команды',
        results: 'Результаты',
        docs: 'Документы',
      }
    : {
        info: 'Информация',
        participants: 'Спортсмены',
        matches: 'Мероприятия',
        results: 'Результаты',
      };

  if (!event) {
    return (
      <Container>
        <H4 className="relative">Такого события не найдено</H4>
      </Container>
    );
  }


  return (
    <Container>
      <Hero
        id={event.id}
        title={event.name}
        badges={event.sports_in_matches}
        buttons={<EventActionButtons />}
        isOwner={isOwner}
        tabsData={tabsData}
        lang={lang}
      />
      {children}
      <AddressSection event={event} />
      {events.length > 0 && <ExpectedEvents events={expectedEvents} />}
    </Container>
  );
}
