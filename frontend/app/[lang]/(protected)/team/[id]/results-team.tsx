import { TextCard } from "@/components/cards/text-card";

type TypeMockData = {
  title?: string;
  text: string;
};

const mockData1: TypeMockData[] = [
  {
    title: 'Информация про Результаты',
    text: 'Лишь ключевые особенности структуры проекта смешаны с не уникальными данными до степени совершенной неузнаваемости, из-за чего возрастает их статус бесполезности. Учитывая ключевые сценарии поведения, синтетическое тестирование создаёт необходимость включения в производственный план целого ряда внеочередных мероприятий с учётом комплекса первоочередных требований. Таким образом, курс на социально-ориентированный национальный проект обеспечивает широкому кругу (специалистов) участие в формировании новых предложений.',
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

export function ResultsTeam() {
  return (
    <div className="flex gap-4" role="tabpanel" aria-labelledby="results">
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
