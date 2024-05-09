import { TextCard } from './text-card';
import { TypeEvent } from '@/lib/definitions';
import { cn, transformDate } from '@/lib/utils';

type TypeMockData = {
  title?: string;
  text: string;
};

export function Info({ event }: { event: TypeEvent }) {
  const mockData1: TypeMockData[] = [
    {
      title: '',
      text: 'В рамках VI III пройдет 5 гран-при с денежным призом и 15 супербоев\n 8× мужской гран-при NO-GI — 88 кг с призовым фондом 400 евро\n 8× мужской гран-при NO-GI — 77 кг с призовым фондом 400 евро\n 8× мужской гран-при NO-GI — 66 кг с призовым фондом 400 евро\n 4× женский гран-при NO-GI — 55 кг с призовым фондом 200 евро\n 4x boys juveniles grand prix no-go with 100 € prize money\n\n Приходите поддержать своих друзей и товарищей по команде!',
    },
    {
      title: 'Продолжительность боя',
      text: 'Взрослые:\nВсе отборочные бои будут длиться 5 минут\nВсе финалы и супербои - 10 минут\n\nЮноши\nВсе отборочные бои по 5 минут\nФинал - 7 минут\n\nВсе финалы и супербои будут разделены на две половины.\nВ первой половине положительные очки не начисляются, начисляются только отрицательные (дисциплинарные наказания). Перерыва между таймами не будет, поэтому после первых 5 минут бой будет продолжен с начислением очков.',
    },
    {
      title: 'Правила',
      text: 'Все взрослые будут соревноваться по правилам IBJJF для черных поясов в соответствии с сабмишенами. \nЭто означает, что в поединках в ги запрещены захваты пяткой, а в поединках без ги разрешены захваты пяткой.  \nЮноши будут соревноваться по правилам IBJJF для юношеских синих поясов no-gi в соответствии с сабмишеном.',
    },
    {
      title: 'Система баллов',
      text: '2 - Тейкдаун, колено на животе, захват, попытка глубокого сабмишна\n3 - Проход через защиту\n4 - Маунт, бэк маунт, бэк тейк\n\nЗолотой балл\nЕсли по окончании основного времени поединка счет ничейный, матч переходит в золотой зачет с ограничением в 2 минуты.',
    },
  ];

  const mockData2: TypeMockData[] = [
    {
      title: transformDate(event?.start_datetime, true),
      text: 'Начало мероприятия',
    },
    {
      title: '1 марта — 10 июня',
      text: 'Приём заявок на участие',
    },
    {
      title: 'Министерство спорта Калининградской области',
      text: 'Организатор',
    },
  ];

  return (
    <div
      className="grid grid-cols-12 gap-4"
      role="tabpanel"
      aria-labelledby="info"
    >
      <ul className="order-2 col-span-12 flex flex-col gap-[18px] sm:order-1 sm:col-span-8">
        <li
          className={cn(
            'bg-card-background flex flex-col items-start rounded-lg p-4 sm:p-5 lg:px-6 lg:py-8',
          )}
        >
          <h4 className="mb-3 text-xl font-semibold text-background sm:text-base md:text-xl">
            Подзаголовок 1
          </h4>
          <p className="text-text-mutedCard whitespace-pre-line text-sm">
            {event.description}
          </p>
        </li>
        <li
          className={cn(
            'bg-card-background flex flex-col items-start rounded-lg p-4 sm:p-5 lg:px-6 lg:py-8',
          )}
        >
          <h4 className="mb-3 text-xl font-semibold text-background sm:text-base md:text-xl">
            Подзаголовок 2
          </h4>
          <p className="text-text-mutedCard whitespace-pre-line text-sm">
            {event.description}
          </p>
        </li>
        <li
          className={cn(
            'bg-card-background flex flex-col items-start rounded-lg p-4 sm:p-5 lg:px-6 lg:py-8',
          )}
        >
          <h4 className="mb-3 text-xl font-semibold text-background sm:text-base md:text-xl">
            Подзаголовок 3
          </h4>
          <p className="text-text-mutedCard whitespace-pre-line text-sm">
            {event.description}
          </p>
        </li>
      </ul>
      <ul className="order-1 col-span-12 grid h-min grid-cols-2 gap-[18px] sm:order-2 sm:col-span-4 sm:grid-cols-1">
        <li
          className={cn(
            'bg-card-backgroundDark flex flex-col items-start rounded-lg p-4 sm:p-5 lg:px-6 lg:py-8',
          )}
        >
          <h4 className="mb-3 text-xl font-semibold text-background sm:text-base md:text-xl">
            {transformDate(event.start_datetime, true)}
          </h4>
          <p className="text-text-mutedCard whitespace-pre-line text-sm">
            Начало мероприятия
          </p>
        </li>
        <li
          className={cn(
            'bg-card-backgroundDark flex flex-col items-start rounded-lg p-4 sm:p-5 lg:px-6 lg:py-8',
          )}
        >
          <h4 className="mb-3 text-xl font-semibold text-background sm:text-base md:text-xl">
            {transformDate(event.end_request_datetime)} —{' '}
            {transformDate(event.end_request_datetime)}
          </h4>
          <p className="text-text-mutedCard whitespace-pre-line text-sm">
            Приём заявок на участие
          </p>
        </li>
        <li
          className={cn(
            'bg-card-backgroundDark col-span-2 flex flex-col items-start rounded-lg p-4 sm:col-span-1 sm:p-5 lg:px-6 lg:py-8',
          )}
        >
          <h4 className="mb-3 text-xl font-semibold text-background sm:text-base md:text-xl">
            Министерство Спорта
          </h4>
          <p className="text-text-mutedCard whitespace-pre-line text-sm">
            Организатор
          </p>
        </li>
      </ul>
    </div>
  );
}
