import { ContentWraper } from '../content-wraper';
import { OrganizationsIcon } from '../icons';

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
    title: 'Система с двойным выбыванием',
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
    title: 'Система с голосованием судей',
  },
  {
    icon: (
      <OrganizationsIcon className="transition-colors group-hover:fill-white" />
    ),
    title: 'Система с возвращением для 3 игроков',
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
    <section className="w-full bg-[#0A0A0A] px-[72px] py-14">
      <ContentWraper>
        <ul className="grid w-full grid-flow-dense grid-cols-4 gap-6">
          <div className="col-start-3 col-end-5 flex flex-col justify-center gap-2">
            <h3 className="to-53% bg-gradient-to-r from-[#95CEFF] from-25%  to-[#0F6CBD] bg-clip-text text-[40px] font-bold leading-[47px] tracking-wide text-transparent">
              Считаете,
              <br />
              что этого мало?
            </h3>
            <p className="max-w-[440px] text-lg text-[#C9C9C9]">
              Напишите нам и расскажите, чего вам не хватает? Мы стремимся
              улучшить спорт!
            </p>
          </div>
          {features.map((feature) => (
            <li
              key={feature.title}
              className="group flex h-[240px] w-full cursor-default flex-col rounded-lg bg-[#0D0D0D] px-8 py-10 transition-colors hover:bg-[#0F6CBD]"
            >
              <div className="mb-4 w-fit">{feature.icon}</div>
              <h4 className="mb-2 w-full text-wrap text-[23px] font-semibold text-[#C9C9C9] group-hover:text-white">
                {feature.title}
              </h4>
            </li>
          ))}
        </ul>
      </ContentWraper>
    </section>
  );
}
