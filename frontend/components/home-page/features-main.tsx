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
      <ChannelShareIcon className="transition-all group-hover:fill-white" />
    ),
    title: 'Турнирная сетка',
    description:
      'Возьмём на себя тяжёлую работу по распределению турниров и отслеживанию результатов.',
  },
  {
    icon: <AppsIcon className="transition-all group-hover:fill-white" />,
    title: 'Регистрации',
    description:
      'Обрабатываем приём заявок и работу с платежами. Просто создайте событие!',
  },
  {
    icon: (
      <DocumentLightningIcon className="transition-all group-hover:fill-white" />
    ),
    title: 'Автоматизация',
    description: 'Результаты событий транслируются онлайн и создаются отчёты.',
  },
  {
    icon: <MoleculeIcon className="transition-all group-hover:fill-white" />,
    title: 'Сообщество',
    description:
      'Присоединяйтесь к нашему сообществу, увеличивающемуся каждый день!',
  },
];

export function FeaturesMain() {
  return (
    <section className="mx-[72px] h-fit sm:h-[298px] w-full bg-[#090707]">
      <ContentWraper>
        <ScrollArea className="w-full whitespace-nowrap rounded-md">
          <ul className="flex w-max gap-4 pb-10 pt-4">
            {features.map((feature) => (
              <li
                key={feature.title}
                className="group flex h-[212px] w-[255px] cursor-default flex-col rounded-lg bg-[#0D0D0D] px-4 py-7 transition-all first-of-type:ml-4 last-of-type:mr-4 hover:bg-[#0F6CBD] sm:w-[270px] lg:h-[228px] lg:w-[308px]"
              >
                <div className="mb-4 w-fit">{feature.icon}</div>
                <h3 className="mb-2 w-full text-wrap text-lg font-semibold lg:text-2xl">
                  {feature.title}
                </h3>
                <p className="w-full text-wrap text-[13px] font-normal text-white opacity-60 transition-all group-hover:text-white group-hover:opacity-100 sm:text-sm lg:text-base">
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
