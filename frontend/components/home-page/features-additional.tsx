import { ContentWraper } from '../content-wraper';
import { OrganizationsIcon } from '../icons';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

type TypeFeaturesAdditional = {
  icon: React.ReactNode;
  title: string;
};

const features: TypeFeaturesAdditional[] = [
  {
    icon: (
      <OrganizationsIcon className="transition-colors group-hover:fill-white" />
    ),
    title: 'Олимпийская система',
  },
  {
    icon: (
      <OrganizationsIcon className="transition-colors group-hover:fill-white" />
    ),
    title: 'Система с двойным выбыванием',
  },
  {
    icon: (
      <OrganizationsIcon className="transition-colors group-hover:fill-white" />
    ),
    title: 'Круговая система',
  },
  {
    icon: (
      <OrganizationsIcon className="transition-colors group-hover:fill-white" />
    ),
    title: 'Система с голосованием судей',
  },
  {
    icon: (
      <OrganizationsIcon className="transition-colors group-hover:fill-white" />
    ),
    title: 'Система с возвращением для 3 игроков',
  },
  {
    icon: (
      <OrganizationsIcon className="transition-colors group-hover:fill-white" />
    ),
    title: 'Серия из 3 игр',
  },
];

export function FeaturesAdditional() {
  return (
    <section className="w-full bg-[#0A0A0A] px-0 py-11 sm:py-14 sm:px-7 md:px-10 lg:px-[72px]">
      <ContentWraper>
        <ScrollArea className="block w-full whitespace-nowrap rounded-md sm:hidden">
          <ul className="flex w-max gap-4 pb-7 pt-4">
            {features.map((feature) => (
              <li
                key={feature.title}
                className="group flex h-[212px] w-[255px] cursor-default flex-col rounded-lg bg-[#0D0D0D] p-8 transition-colors hover:bg-[#0F6CBD] first-of-type:ml-4 last-of-type:mr-4"
              >
                <div className="mb-4 w-fit">{feature.icon}</div>
                <h4 className="mb-2 w-full text-wrap text-lg font-semibold text-[#C9C9C9] group-hover:text-white">
                  {feature.title}
                </h4>
              </li>
            ))}
          </ul>
          <ScrollBar className="hidden" orientation="horizontal" />
        </ScrollArea>
        <ul className="flex w-full flex-col sm:grid sm:grid-flow-dense sm:grid-cols-4 sm:gap-4 lg:gap-6">
          <div className="flex flex-col justify-center gap-4 sm:gap-2 mx-10 sm:mx-0 sm:col-start-3 sm:col-end-5">
            <h3 className="to-53% bg-gradient-to-r from-[#95CEFF] from-25%  to-[#0F6CBD] bg-clip-text text-2xl font-bold leading-7 tracking-wide text-transparent sm:text-3xl md:text-4xl md:leading-[47px] lg:text-[40px]">
              Считаете,
              <br />
              что этого мало?
            </h3>
            <p className="max-w-[440px] text-[#C9C9C9] md:text-base lg:text-lg">
              Напишите нам и расскажите, чего вам не хватает? Мы стремимся
              улучшить спорт!
            </p>
          </div>
          {features.map((feature) => (
            <li
              key={feature.title}
              className="group hidden w-full cursor-default flex-col rounded-lg bg-[#0D0D0D] px-2 py-3 transition-colors hover:bg-[#0F6CBD] sm:flex md:px-3 md:py-5 lg:h-[200px] lg:py-6 xl:h-[240px] xl:px-8 xl:py-10"
            >
              <div className="mb-4 w-fit">{feature.icon}</div>
              <h4 className="mb-2 w-full text-wrap    font-semibold text-[#C9C9C9] group-hover:text-white md:text-base lg:text-xl xl:text-[23px]">
                {feature.title}
              </h4>
            </li>
          ))}
        </ul>
      </ContentWraper>
    </section>
  );
}
