import Image from 'next/image';
import { TeamMember } from '@/app/[lang]/(protected)/team/[id]/page';
import { TextCard } from './text-card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { calculateAge, getInitials, getRussianAgeWord } from '@/lib/utils';
import { H4, PersonDescriptionOnCard } from '../text';
import { Country, Region } from '@/lib/definitions';
import { Badge } from '../ui/badge';

interface AthleteCardProps
  extends Omit<TeamMember, 'height' | 'sport_types' | 'coaches' | 'gender'> {
  captainId?: number;
  isApproved?: boolean;
}

export function AthleteCard({
  id,
  sirname,
  name,
  fathername,
  birthdate,
  city,
  country,
  region,
  image_field,
  weight,
  captainId = 0,
  isApproved = true,
}: AthleteCardProps) {
  const athleteAge = calculateAge(birthdate);
  return (
    <TextCard className="relative cursor-default flex-row gap-4 transition-colors hover:bg-card-hoverGray lg:px-4 lg:py-3">
      <div className="flex w-2/3 items-center gap-4">
        <div className="relative h-10 w-10">
          <Avatar className="row-span-4 h-10 w-10 text-foreground duration-300 group-hover:text-primary-mainAccent sm:mt-5 md:mt-3 lg:mt-0">
            <AvatarImage src={image_field} alt="" />
            <AvatarFallback className="text-base font-medium">
              {getInitials('asf', 'asdf') || ''}
            </AvatarFallback>
          </Avatar>
          {isApproved && (
            <Image
              className="absolute bottom-0 right-0"
              src={'/images/icons/checked.svg'}
              alt=""
              width={16}
              height={16}
            />
          )}
        </div>
        <div className="flex flex-col">
          <H4 className="text-white">
            {sirname} {name} {fathername}
          </H4>
          <PersonDescriptionOnCard className="text-neutralForeground3">
            {city}, {Region[region]}, {Country[country]}
          </PersonDescriptionOnCard>
          <PersonDescriptionOnCard className="text-neutralForeground3">
            <b>{birthdate.split('-')[0]}</b> г.р.,{' '}
            <i>(возраст: {getRussianAgeWord(athleteAge)})</i>
          </PersonDescriptionOnCard>
        </div>
      </div>
      <div className="w-1/3">
        <H4 className="text-white">{weight} кг</H4>
        <PersonDescriptionOnCard className="text-neutralForeground3">
          {'Уровень атлета не указан'}
        </PersonDescriptionOnCard>
        <PersonDescriptionOnCard className="text-neutralForeground3">
          {'Клуб не указан'}
        </PersonDescriptionOnCard>
      </div>
      {captainId === id && (
        <Badge className="absolute right-3 top-3 bg-primary-mainAccent hover:cursor-default hover:bg-primary-mainAccent">
          Капитан
        </Badge>
      )}
    </TextCard>
  );
}
