'use client';

import { TextCard } from '@/components/cards/text-card';
import { ModeSwither } from '../mode-switcher';
import { useState } from 'react';
import Image from 'next/image';
import { H4, PersonDescriptionOnCard } from '../text';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { getInitials } from '@/lib/utils';

export function Results() {
  const [isMedalMode, setIsMedalMode] = useState<boolean>(true);
  return (
    <div
      className="flex flex-col gap-4"
      role="tabpanel"
      aria-labelledby="results"
    >
      <ModeSwither
        className="relative"
        id={'results'}
        label={'Медали'}
        alternativeLabel={'Очки'}
        setIsOnMode={setIsMedalMode}
        isOnMode={isMedalMode}
      />
      <ul className="flex w-full justify-between">
        <WinnersList athletes={[]} medal={'gold'} />
        <WinnersList athletes={[]} medal={'silver'} />
        <WinnersList athletes={[]} medal={'bronze'} />
      </ul>
    </div>
  );
}

interface WinnersListProps {
  athletes: any; // fix "any",
  medal: 'gold' | 'silver' | 'bronze';
}

export function WinnersList({ athletes, medal }: WinnersListProps) {
  return (
    <li>
      <Image
        src={`/images/medals/${medal}.svg`}
        alt=""
        width={213}
        height={241}
      />
      {!!athletes.length ? (
        <AthleteCardSmall />
      ) : (
        <PersonDescriptionOnCard className="mb-5 mr-auto text-base text-background">
          Нет спортсменов с этой наградой
        </PersonDescriptionOnCard>
      )}
    </li>
  );
}

interface AthleteCardSmallProps {
  avatar: string;
  name: string;
  sirname: string;
  fathername: string;
}

export function AthleteCardSmall() {
  return (
    <TextCard className="relative cursor-default flex-col gap-4 transition-colors hover:bg-card-hoverGray sm:flex-row lg:px-4 lg:py-3">
      <div className="flex w-full flex-row-reverse justify-between gap-4 sm:w-2/3 sm:flex-row sm:justify-start xl:items-center">
        <div className="relative h-14 w-14 sm:h-10 sm:w-10">
          <Avatar className="row-span-4 h-14 w-14 text-foreground duration-300 group-hover:text-primary-mainAccent sm:h-10 sm:w-10">
            <AvatarImage src="" alt="" />
            <AvatarFallback className="text-base font-medium">
              {getInitials('name', 'sirname') || ''}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col">
          <H4 className="text-white">
            {'sirname'} {'name'} {'fathername'}
          </H4>
          <PersonDescriptionOnCard className="text-neutralForeground3">
            {'city'}, {'AllRegions[region]'}, {'Country[country]'}
          </PersonDescriptionOnCard>
          <PersonDescriptionOnCard className="text-neutralForeground3">
            <b>{`birthdate.split('-')[0]`}</b> г.р.,{' '}
            {/* <i>(возраст: {getRussianAgeWord(athleteAge)})</i> */}
          </PersonDescriptionOnCard>
        </div>
      </div>
    </TextCard>
  );
}
