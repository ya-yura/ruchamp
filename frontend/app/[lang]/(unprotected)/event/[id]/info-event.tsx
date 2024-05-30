import { TextCard } from '@/components/cards/text-card';
import { Event } from '@/lib/definitions';
import { TextCardFieldWithTwoLists } from '@/components/cards/text-card-field-with-two-lists';
import { transformDate } from '@/lib/utils/date-and-time';

export function InfoEvent({ event }: { event: Event }) {
  const eventStartTime = transformDate(event.start_datetime, true);
  const applicationTime = `${transformDate(event.end_request_datetime)} – ${transformDate(event.end_request_datetime)}`;

  return (
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
  );
}

function MainEventInfo({ description }: { description: string }) {
  return (
    <>
      <TextCard title={'Подзаголовок 1'} text={description} />
      <TextCard
        title={'Подзаголовок 2'}
        text={`От массовости – к мастерству!`}
      />
      <TextCard
        title={'Подзаголовок 3'}
        text={`Приглашаем принять участие в нашем мероприятии!`}
      />
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
