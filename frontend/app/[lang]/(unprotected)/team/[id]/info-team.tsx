import { calculateAge, getInitials, getRussianAgeWord } from '@/lib/utils';
import { Coach, TeamInfo, TeamMember } from './page';
import { TextCard } from '@/components/cards/text-card';
import {
  H4,
  PersonDescriptionOnCard,
  PersonNameOnCard,
} from '@/components/text';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TextCardFieldWithTwoLists } from '@/components/cards/text-card-field-with-two-lists';
import { Country, AllRegions } from '@/lib/definitions';
import { Locale } from '@/i18n.config';

interface InfoTeamProps {
  teamInfo: TeamInfo;
  captain: TeamMember | undefined;
  coaches: Coach[];
  lang: Locale;
}

export function InfoTeam({ teamInfo, captain, coaches, lang }: InfoTeamProps) {
  return (
    <TextCardFieldWithTwoLists
      firstList={<MainTeamInfo teamInfo={teamInfo} />}
      secondList={<CaptainAndCoaches captain={captain} coaches={coaches} />}
    />
  );
}

function CaptainAndCoaches({
  captain,
  coaches,
}: {
  captain: TeamMember | undefined;
  coaches: Coach[];
}) {
  const captainAge = calculateAge(captain?.birthdate || '');
  return (
    <>
      {captain ? (
        <TextCard className="grid gap-x-3 gap-y-2 bg-card-backgroundDark  sm:grid-cols-2 xl:grid-cols-[1fr_3fr]">
          <Avatar className="row-span-4 h-32 w-32 text-foreground duration-300 sm:mt-5 md:mt-3 lg:mt-0">
            <AvatarImage src={captain.image_field} alt="" />
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
            {captain.city}, {AllRegions[captain.region]},{' '}
            {Country[captain.country]}
          </PersonDescriptionOnCard>
          <PersonDescriptionOnCard className="col-start-2 sm:col-span-2 sm:col-start-1 xl:col-start-2">
            <b>{captain.birthdate.split('-')[0]} г.р.</b>,{' '}
            <i>(возраст: {getRussianAgeWord(captainAge)})</i>
          </PersonDescriptionOnCard>
        </TextCard>
      ) : (
        <TextCard className="grid gap-6 bg-card-backgroundDark">
          <H4 className="col-start-1">Капитан</H4>
          <PersonDescriptionOnCard className="col-start-1">
            Информация отсутствует
          </PersonDescriptionOnCard>
        </TextCard>
      )}
      <TextCard className="gap-5 bg-card-backgroundDark" title={'Тренеры'}>
        {!!coaches.length ? (
          <ul className="flex flex-col gap-4">
            {coaches.map((coach, index) => (
              <CoachItem
                key={index}
                name={coach.name}
                fathername={coach.fathername}
                sirname={coach.sirname}
                qualification_level={coach.qualification_level}
              />
            ))}
          </ul>
        ) : (
          <PersonDescriptionOnCard>Не указаны</PersonDescriptionOnCard>
        )}
      </TextCard>
    </>
  );
}

function MainTeamInfo({ teamInfo }: { teamInfo: TeamInfo }) {
  return (
    <>
      <TextCard title={'Подзаголовок 1'} text={teamInfo.description} />
      <TextCard title={'Подзаголовок 2'} text={`Наш капитан - лучший!!!`} />
      <TextCard title={'Подзаголовок 3'} text={`Обожаем наших тренеров!`} />
    </>
  );
}

function CoachItem({ name, sirname, fathername, qualification_level }: Coach) {
  return (
    <li>
      <PersonNameOnCard>
        {sirname} {name} {fathername}
      </PersonNameOnCard>
      <PersonDescriptionOnCard className="text-sm text-neutralForeground3Rest">
        Квалификация: {qualification_level}
      </PersonDescriptionOnCard>
    </li>
  );
}
