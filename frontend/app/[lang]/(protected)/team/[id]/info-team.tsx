import { getInitials } from '@/lib/utils';
import { Captain, CoachDetails, TeamById } from './page';
import { TextCard } from '@/app/[lang]/(unprotected)/event/[id]/text-card';
import {
  H4,
  PersonDescriptionOnCard,
  PersonNameOnCard,
} from '@/components/text';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CoachItemProps {
  name: string;
  sirname: string;
  fathername: string;
  qualification: number;
}
interface InfoTeamProps {
  teamInfo: TeamById;
  captain: Captain;
  coaches: CoachDetails[];
}

export function InfoTeam({ teamInfo, captain, coaches }: InfoTeamProps) {
  const temporaryAvatarId = captain.name.charCodeAt(0).toString().slice(-2, -1); // temporary data

  return (
    <div
      className="grid grid-cols-12 gap-4"
      role="tabpanel"
      aria-labelledby="info"
    >
      <ul className="order-2 col-span-12 flex flex-col gap-[18px] sm:order-1 sm:col-span-8">
        <TextCard title={'Подзаголовок 1'} text={teamInfo.description} />
        <TextCard
          title={'Подзаголовок 2'}
          text={`Наш капитан ${captain.sirname} ${captain.name} - лучший!!!`}
        />
        <TextCard
          title={'Подзаголовок 3'}
          text={`Обожаем наших тренеров:
            ${coaches
              .map((coach) => `${coach.sirname} ${coach.name}`)
              .join(', ')}`}
        />
      </ul>
      <ul className="order-1 col-span-12 grid h-min gap-[18px] sm:order-2 sm:col-span-4 sm:grid-cols-1">
        <TextCard className="grid gap-x-6 gap-y-2 bg-card-backgroundDark  sm:grid-cols-2">
          <Avatar className="row-span-4 h-32 w-32 text-foreground duration-300 group-hover:text-primary-mainAccent sm:mt-5 md:mt-3 lg:mt-0">
            <AvatarImage
              src={`https://i.pravatar.cc/300?img=${temporaryAvatarId}`}
              alt=""
            />
            <AvatarFallback className="text-6xl font-black">
              {getInitials(captain.name, captain.sirname) || ''}
            </AvatarFallback>
          </Avatar>
          <H4 className="col-start-2 text-left sm:text-right xl:text-left">
            Капитан
          </H4>
          <PersonNameOnCard className="col-start-2 sm:col-span-2 sm:col-start-1 lg:col-span-1 lg:col-start-2 lg:text-right xl:text-left">
            {captain.sirname} {captain.name} {captain.fathername}
          </PersonNameOnCard>
          <PersonDescriptionOnCard className="col-start-2 sm:col-span-2 sm:col-start-1 xl:col-start-2">
            Город, регион, страна
          </PersonDescriptionOnCard>
          <PersonDescriptionOnCard className="col-start-2 sm:col-span-2 sm:col-start-1 xl:col-start-2">
            <b>Год рождения</b>, (возраст)
          </PersonDescriptionOnCard>
        </TextCard>
        <TextCard className="gap-5 bg-card-backgroundDark" title={'Тренеры'}>
          {!!coaches.length ? (
            <ul className="flex flex-col gap-4">
              {coaches.map((coach, index) => (
                <CoachItem
                  key={index}
                  name={coach.name}
                  fathername={coach.fathername}
                  sirname={coach.sirname}
                  qualification={coach.qualification_level}
                />
              ))}
            </ul>
          ) : (
            <PersonDescriptionOnCard>Не указаны</PersonDescriptionOnCard>
          )}
        </TextCard>
      </ul>
    </div>
  );
}

export function CoachItem({
  name,
  sirname,
  fathername,
  qualification,
}: CoachItemProps) {
  return (
    <li>
      <PersonNameOnCard>
        {sirname} {name} {fathername}
      </PersonNameOnCard>
      <PersonDescriptionOnCard className="text-neutralForeground3Rest text-sm">
        Квалификация: {qualification}
      </PersonDescriptionOnCard>
    </li>
  );
}
