import { H4 } from '@/components/text';
import { TextCard } from '@/components/cards/text-card';
import { Event } from '@/lib/definitions';
import { cn, transformDate } from '@/lib/utils';

export function Info({ event }: { event: Event }) {
  return (
    <div
      className="grid grid-cols-12 gap-4"
      role="tabpanel"
      aria-labelledby="info"
    >
      <ul className="order-2 col-span-12 flex flex-col gap-[18px] sm:order-1 sm:col-span-8">
        <li
          className={cn(
            'flex flex-col items-start rounded-lg bg-card-background p-4 sm:p-5 lg:px-6 lg:py-8',
          )}
        >
          <H4 className="mb-3 text-xl font-semibold text-background sm:text-base md:text-xl">
            Подзаголовок 1
          </H4>
          <p className="whitespace-pre-line text-sm text-text-mutedCard">
            {event.description}
          </p>
        </li>
        <li
          className={cn(
            'flex flex-col items-start rounded-lg bg-card-background p-4 sm:p-5 lg:px-6 lg:py-8',
          )}
        >
          <H4 className="mb-3 text-xl font-semibold text-background sm:text-base md:text-xl">
            Подзаголовок 2
          </H4>
          <p className="whitespace-pre-line text-sm text-text-mutedCard">
            {event.description}
          </p>
        </li>
        <li
          className={cn(
            'flex flex-col items-start rounded-lg bg-card-background p-4 sm:p-5 lg:px-6 lg:py-8',
          )}
        >
          <H4 className="mb-3 text-xl font-semibold text-background sm:text-base md:text-xl">
            Подзаголовок 3
          </H4>
          <p className="whitespace-pre-line text-sm text-text-mutedCard">
            {event.description}
          </p>
        </li>
      </ul>
      <ul className="order-1 col-span-12 grid h-min grid-cols-2 gap-[18px] sm:order-2 sm:col-span-4 sm:grid-cols-1">
        <li
          className={cn(
            'flex flex-col items-start rounded-lg bg-card-backgroundDark p-4 sm:p-5 lg:px-6 lg:py-8',
          )}
        >
          <H4 className="mb-3 text-xl font-semibold text-background sm:text-base md:text-xl">
            {transformDate(event.start_datetime, true)}
          </H4>
          <p className="whitespace-pre-line text-sm text-text-mutedCard">
            Начало мероприятия
          </p>
        </li>
        <li
          className={cn(
            'flex flex-col items-start rounded-lg bg-card-backgroundDark p-4 sm:p-5 lg:px-6 lg:py-8',
          )}
        >
          <H4 className="mb-3 text-xl font-semibold text-background sm:text-base md:text-xl">
            {transformDate(event.end_request_datetime)} —{' '}
            {transformDate(event.end_request_datetime)}
          </H4>
          <p className="whitespace-pre-line text-sm text-text-mutedCard">
            Приём заявок на участие
          </p>
        </li>
        <li
          className={cn(
            'col-span-2 flex flex-col items-start rounded-lg bg-card-backgroundDark p-4 sm:col-span-1 sm:p-5 lg:px-6 lg:py-8',
          )}
        >
          <H4 className="mb-3 text-xl font-semibold text-background sm:text-base md:text-xl">
            Министерство Спорта
          </H4>
          <p className="whitespace-pre-line text-sm text-text-mutedCard">
            Организатор
          </p>
        </li>
      </ul>
    </div>
  );
}

//  function MainEventInfo() {
//   return (
//     <>
//     <TextCard title={'Подзаголовок 1'} text={event.description} />
//     </>
//   )
// }

//  function DatesAndOrganizer() {
//   return (
//     <div>DatesAndOrganizer</div>
//   )
// }
