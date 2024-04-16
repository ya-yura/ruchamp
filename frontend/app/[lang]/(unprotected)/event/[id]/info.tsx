import { TextCard } from './text-card';
import { TypeEvent } from '@/lib/definitions';
import { transformDate } from '@/lib/utils';

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
    <div className="flex gap-4" role="tabpanel" aria-labelledby="info">
      <div className="flex w-2/3 flex-col gap-[18px]">
        {mockData1.map((item) => (
          <TextCard key={item.title} title={item.title} text={item.text} />
        ))}
      </div>
      <div className="flex w-1/3 flex-col gap-[18px]">
        {mockData2.map((item) => (
          <TextCard key={item.title} title={item.title} text={item.text} />
        ))}
      </div>
    </div>
  );
}
