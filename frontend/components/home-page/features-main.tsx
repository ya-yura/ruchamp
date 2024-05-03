import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import {
  AppsIcon,
  ChannelShareIcon,
  DocumentLightningIcon,
  MoleculeIcon,
} from '../icons';
import { ContentWraper } from '../content-wraper';
import { cn } from '@/lib/utils';

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
    <section className="bg-primary-almostBlack mx-[72px] h-fit w-full sm:h-[298px]">
      <ContentWraper className='max-w-full'>
        <ScrollArea className="w-full whitespace-nowrap rounded-md">
          <ul className="flex w-max gap-4 pb-10 pt-4 lg:mx-auto">
            {features.map((feature) => (
              <FeatureMain key={feature.title} feature={feature} />
            ))}
          </ul>
          <ScrollBar className="hidden" orientation="horizontal" />
        </ScrollArea>
      </ContentWraper>
    </section>
  );
}

export function FeatureMain({ feature }: { feature: TypeFeaturesMain }) {
  return (
    <li
      className={cn(
        'group flex h-[212px] w-[255px] cursor-default flex-col rounded-lg bg-[#0D0D0D] px-4 py-7',
        ' transition-all first-of-type:ml-4 last-of-type:mr-4 hover:bg-[#0F6CBD] sm:w-[270px]',
        'lg:h-[228px] lg:w-[308px] lg:first-of-type:ml-[72px] lg:last-of-type:mr-[72px]',
      )}
    >
      <div className="mb-4 w-fit">{feature.icon}</div>
      <h3 className="mb-2 w-full text-wrap text-lg font-semibold text-background lg:text-2xl">
        {feature.title}
      </h3>
      <p className="w-full text-wrap text-[13px] font-normal text-white opacity-60 transition-all group-hover:text-white group-hover:opacity-100 sm:text-sm lg:text-base">
        {feature.description}
      </p>
    </li>
  );
}
