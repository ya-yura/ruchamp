import { TextCard } from "@/app/[lang]/(unprotected)/event/[id]/text-card";

type TypeMockData = {
  title?: string;
  text: string;
};

const mockData1: TypeMockData[] = [
  {
    title: 'Информация про Матчи',
    text: 'Господа, дальнейшее развитие различных форм деятельности в значительной степени обусловливает важность вывода текущих активов. Есть над чем задуматься: акционеры крупнейших компаний, инициированные исключительно синтетически, объективно рассмотрены соответствующими инстанциями. Мы вынуждены отталкиваться от того, что высококачественный прототип будущего проекта однозначно определяет каждого участника как способного принимать собственные решения касаемо дальнейших направлений развития.',
  },
];

const mockData2: TypeMockData[] = [
  {
    title: '12 июня, 14:00',
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

export function MatchesTeam() {
  return (
    <div className="flex gap-4" role="tabpanel" aria-labelledby="matches">
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
