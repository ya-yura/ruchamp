'use client';

import Image from 'next/image';
import { ModeSwither } from '../mode-switcher';
import { useState } from 'react';
import { PersonDescriptionOnCard } from '../text';
import { AthleteCard } from '../cards/athlete-card';
import {
  MedalWinner,
  Medals,
  TeamMemberWithResults,
} from '@/app/[lang]/(unprotected)/team/[id]/page';
import { AthleteCardSmall } from '../cards/athlete-card-small';

export interface AthleteWithPoints {
  id: number;
  sirname: string;
  name: string;
  fathername: string;
  birthdate: string;
  gender?: boolean;
  height?: number;
  weight: number;
  image_field: string;
  country: number;
  region: number;
  city: string;
  points?: number;
  medals?: Medals;
  medal?: 'gold' | 'silver' | 'bronze' | 'none';
  isWithResults?: boolean;
}

interface ResultsProps {
  goldenMedalWinners: MedalWinner[];
  silverMedalWinners: MedalWinner[];
  bronzeMedalWinners: MedalWinner[];
  athletes: AthleteWithPoints[];
}

export function Results({
  goldenMedalWinners,
  silverMedalWinners,
  bronzeMedalWinners,
  athletes,
}: ResultsProps) {
  const [isMedalMode, setIsMedalMode] = useState<boolean>(true);
  return (
    <div
      className="flex w-full flex-col gap-4"
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
      {isMedalMode ? (
        <ul className="grid w-full grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-3">
          <WinnersList athletes={goldenMedalWinners} medal={'gold'} />
          <WinnersList athletes={silverMedalWinners} medal={'silver'} />
          <WinnersList athletes={bronzeMedalWinners} medal={'bronze'} />
        </ul>
      ) : (
        <AthleteListByPoints athletes={athletes} />
      )}
    </div>
  );
}

interface WinnersListProps {
  athletes: MedalWinner[];
  medal: 'gold' | 'silver' | 'bronze';
}

function WinnersList({ athletes, medal }: WinnersListProps) {
  return (
    <li className="flex flex-col items-center gap-7">
      <Image
        src={`/images/medals/${medal}.svg`}
        alt=""
        width={213}
        height={241}
      />
      {!!athletes.length ? (
        <ul className="flex flex-col gap-3">
          {athletes.map((athlete) => (
            <AthleteCardSmall
              key={athlete.match_id}
              sirname={athlete.sirname}
              name={athlete.name}
              fathername={athlete.fathername}
              birthdate={athlete.birthdate}
              gender={athlete.gender}
              weight={athlete.weight}
              image_field={athlete.image_field}
              country={athlete.country}
              region={athlete.region}
              city={athlete.city}
              event_name={athlete.event_name}
              match_name={athlete.match_name}
              event_location={athlete.event_location}
              start_datetime={athlete.start_datetime}
              sport_type={athlete.sport_type}
            />
          ))}
        </ul>
      ) : (
        <PersonDescriptionOnCard className="mb-5 text-center text-base text-background">
          Нет спортсменов с этой наградой
        </PersonDescriptionOnCard>
      )}
    </li>
  );
}

function AthleteListByPoints({
  athletes,
}: {
  athletes: AthleteWithPoints[];
}) {
  return (
    <>
      {!!athletes.length ? (
        <ul className="flex flex-col gap-3">
          {athletes.map((athlete) => (
            <AthleteCard
              key={athlete.id}
              id={athlete.id}
              sirname={athlete.sirname}
              name={athlete.name}
              fathername={athlete.fathername}
              birthdate={athlete.birthdate}
              city={athlete.city}
              country={athlete.country}
              region={athlete.region}
              image_field={athlete.image_field}
              weight={athlete.weight}
              points={athlete.points}
              medals={athlete.medals}
              medal={athlete.medal}
              isWithResults={true}
            />
          ))}
        </ul>
      ) : (
        <PersonDescriptionOnCard className="mb-5 mr-auto text-base text-background">
          Ничего не найдено
        </PersonDescriptionOnCard>
      )}
    </>
  );
}
