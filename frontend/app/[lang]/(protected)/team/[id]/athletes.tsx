import { TextCard } from "@/app/[lang]/(unprotected)/event/[id]/text-card";

type TypeMockData = {
  title?: string;
  text: string;
};

const mockData1: TypeMockData[] = [
  {
    title: 'Информация про Атлетов',
    text: 'Как уже неоднократно упомянуто, сделанные на базе интернет-аналитики выводы, инициированные исключительно синтетически, подвергнуты целой серии независимых исследований. Задача организации, в особенности же консультация с широким активом предопределяет высокую востребованность инновационных методов управления процессами. В рамках спецификации современных стандартов, тщательные исследования конкурентов объединены в целые кластеры себе подобных.',
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

export function Athletes() {
  return (
    <div className="flex gap-4" role="tabpanel" aria-labelledby="athletes">
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
