import Image from 'next/image';
import { Medals, TeamMember } from '@/app/[lang]/(unprotected)/team/[id]/page';
import { TextCard } from './text-card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { calculateAge, getInitials, getRussianAgeWord } from '@/lib/utils';
import { H4, PersonDescriptionOnCard } from '../text';
import { Country, AllRegions } from '@/lib/definitions';
import { Badge } from '../ui/badge';

interface AthleteCardProps
  extends Omit<
    TeamMember,
    'height' | 'sport_types' | 'coaches' | 'gender' | 'grade_types'
  > {
  captainId?: number;
  isApproved?: boolean;
  points?: number;
  medals?: Medals;
  isWithResults?: boolean;
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
  points,
  medals,
  isWithResults,
}: AthleteCardProps) {
  const athleteAge = calculateAge(birthdate);
  function getMedalsText(medals: Medals): React.ReactNode {
    const medalsText: string[] = [];
    if (medals.golden > 0) {
      medalsText.push(`золото ${medals.golden}`);
    }
    if (medals.silver > 0) {
      medalsText.push(`серебро ${medals.silver}`);
    }
    if (medals.bronze > 0) {
      medalsText.push(`бронза ${medals.bronze}`);
    }
    return medalsText.length > 0 ? (
      <span>
        <b>Медали:</b> {medalsText.join(', ')}
      </span>
    ) : (
      <></>
    );
  }

  return (
    <TextCard className="relative cursor-default flex-col gap-4 transition-colors hover:bg-card-hoverGray sm:flex-row lg:px-4 lg:py-3">
      <div className="flex w-full flex-row-reverse justify-between gap-4 sm:w-2/3 sm:flex-row sm:justify-start xl:items-center">
        <div className="relative h-14 w-14 sm:h-10 sm:w-10">
          <Avatar className="h-14 w-14 text-foreground sm:h-10 sm:w-10">
            <AvatarImage src={image_field} alt="" />
            <AvatarFallback className="text-base font-medium">
              {getInitials(name, sirname) || ''}
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
            {city}, {AllRegions[region]}, {Country[country]}
          </PersonDescriptionOnCard>
          <PersonDescriptionOnCard className="text-neutralForeground3">
            <b>{birthdate.split('-')[0]}</b> г.р.,{' '}
            <i>(возраст: {getRussianAgeWord(athleteAge)})</i>
          </PersonDescriptionOnCard>
        </div>
      </div>
      <div className="w-full sm:w-1/3">
        <H4 className="text-white">{weight} кг</H4>
        {isWithResults ? (
          <>
            <PersonDescriptionOnCard className="text-neutralForeground3">
              <b>Очков: {points}</b>
            </PersonDescriptionOnCard>
            {(!!medals?.golden || !!medals?.silver || !!medals?.bronze) && (
              <PersonDescriptionOnCard className="text-neutralForeground3">
                {getMedalsText(medals)}
              </PersonDescriptionOnCard>
            )}
          </>
        ) : (
          <>
            <PersonDescriptionOnCard className="text-neutralForeground3">
              {'Уровень атлета не указан'}
            </PersonDescriptionOnCard>
            <PersonDescriptionOnCard className="text-neutralForeground3">
              {'Клуб не указан'}
            </PersonDescriptionOnCard>
          </>
        )}
      </div>
      {captainId === id && (
        <Badge className="absolute bottom-[120px] right-3 flex h-6 bg-primary-mainAccent px-2 py-1 hover:cursor-default hover:bg-primary-mainAccent sm:top-3">
          Капитан
        </Badge>
      )}
    </TextCard>
  );
}
