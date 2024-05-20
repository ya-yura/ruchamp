import { Event } from '@/lib/definitions';
import { cn, transformDate } from '@/lib/utils';

export function Info() {
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
          <h4 className="mb-3 text-xl font-semibold text-background sm:text-base md:text-xl">
            Подзаголовок 1
          </h4>
          <p className="whitespace-pre-line text-sm text-text-mutedCard">
            {/* {event.description} */}
          </p>
        </li>
        <li
          className={cn(
            'flex flex-col items-start rounded-lg bg-card-background p-4 sm:p-5 lg:px-6 lg:py-8',
          )}
        >
          <h4 className="mb-3 text-xl font-semibold text-background sm:text-base md:text-xl">
            Подзаголовок 2
          </h4>
          <p className="whitespace-pre-line text-sm text-text-mutedCard">
            {/* {event.description} */}
          </p>
        </li>
        <li
          className={cn(
            'flex flex-col items-start rounded-lg bg-card-background p-4 sm:p-5 lg:px-6 lg:py-8',
          )}
        >
          <h4 className="mb-3 text-xl font-semibold text-background sm:text-base md:text-xl">
            Подзаголовок 3
          </h4>
          <p className="whitespace-pre-line text-sm text-text-mutedCard">
            {/* {event.description} */}
          </p>
        </li>
      </ul>
      <ul className="order-1 col-span-12 grid h-min grid-cols-2 gap-[18px] sm:order-2 sm:col-span-4 sm:grid-cols-1">
        <li
          className={cn(
            'flex flex-col items-start rounded-lg bg-card-backgroundDark p-4 sm:p-5 lg:px-6 lg:py-8',
          )}
        >
          <h4 className="mb-3 text-xl font-semibold text-background sm:text-base md:text-xl">
            {/* {transformDate(event.start_datetime, true)} */}
          </h4>
          <p className="whitespace-pre-line text-sm text-text-mutedCard">
            Начало мероприятия
          </p>
        </li>
        <li
          className={cn(
            'flex flex-col items-start rounded-lg bg-card-backgroundDark p-4 sm:p-5 lg:px-6 lg:py-8',
          )}
        >
          <h4 className="mb-3 text-xl font-semibold text-background sm:text-base md:text-xl">
            {/* {transformDate(event.end_request_datetime)} —{' '} */}
            {/* {transformDate(event.end_request_datetime)} */}
          </h4>
          <p className="whitespace-pre-line text-sm text-text-mutedCard">
            Приём заявок на участие
          </p>
        </li>
        <li
          className={cn(
            'col-span-2 flex flex-col items-start rounded-lg bg-card-backgroundDark p-4 sm:col-span-1 sm:p-5 lg:px-6 lg:py-8',
          )}
        >
          <h4 className="mb-3 text-xl font-semibold text-background sm:text-base md:text-xl">
            Министерство Спорта
          </h4>
          <p className="whitespace-pre-line text-sm text-text-mutedCard">
            Организатор
          </p>
        </li>
      </ul>
    </div>
  );
}
