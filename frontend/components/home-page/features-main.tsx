import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import {
  AppsIcon,
  ChannelShareIcon,
  DocumentLightningIcon,
  MoleculeIcon,
} from '../icons';
import { ContentWraper } from '../content-wraper';

type TypeFeaturesMain = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const features: TypeFeaturesMain[] = [
  {
    icon: (
      <ChannelShareIcon className="transition-colors group-hover:fill-white" />
    ),
    title: 'Турнирная сетка',
    description:
      'Возьмём на себя тяжёлую работу по распределению турниров и отслеживанию результатов.',
  },
  {
    icon: <AppsIcon className="transition-colors group-hover:fill-white" />,
    title: 'Регистрации',
    description:
      'Обрабатываем приём заявок и работу с платежами. Просто создайте событие!',
  },
  {
    icon: (
      <DocumentLightningIcon className="transition-colors group-hover:fill-white" />
    ),
    title: 'Автоматизация',
    description:
      'Результаты событий транслируются онлайн и создаются отчёты.',
  },
  {
    icon: <MoleculeIcon className="transition-colors group-hover:fill-white" />,
    title: 'Сообщество',
    description:
      'Присоединяйтесь к нашему сообществу, увеличивающемуся каждый день!',
  },
];

export function FeaturesMain() {
  return (
    <section className="h-[298px] w-full bg-[#090707] mx-[72px]">
      <ContentWraper>
        <ScrollArea className="w-full whitespace-nowrap rounded-md">
          <ul className="flex w-max space-x-4 pb-10 pt-4">
            {features.map((feature) => (
              <li
                key={feature.title}
                className="group flex h-[228px] w-[308px] cursor-default flex-col rounded-lg bg-[#0D0D0D] px-6 py-8 transition-colors hover:bg-[#0F6CBD]"
              >
                <div className="mb-4 w-fit">{feature.icon}</div>
                <h3 className="mb-2 w-full text-wrap text-2xl font-semibold">
                  {feature.title}
                </h3>
                <p className="w-full text-wrap text-base font-normal text-gray-500 transition-colors group-hover:text-white">
                  {feature.description}
                </p>
              </li>
            ))}
          </ul>
          <ScrollBar className="hidden" orientation="horizontal" />
        </ScrollArea>
      </ContentWraper>
    </section>
  );
}
