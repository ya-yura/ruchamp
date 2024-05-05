import { TextCard } from './text-card';

type TypeMockData = {
  title?: string;
  text: string;
};

const mockData1: TypeMockData[] = [
  {
    title: 'Информация про Турнирую сетку',
    text: 'Банальные, но неопровержимые выводы, а также некоторые особенности внутренней политики указаны как претенденты на роль ключевых факторов. Современные технологии достигли такого уровня, что сплочённость команды профессионалов требует определения и уточнения соответствующих условий активизации. Разнообразный и богатый опыт говорит нам, что современная методология разработки однозначно фиксирует необходимость экспериментов, поражающих по своей масштабности и грандиозности.',
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

export function Grid() {
  return (
    <div className="flex gap-4" role="tabpanel" aria-labelledby="grid">
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
