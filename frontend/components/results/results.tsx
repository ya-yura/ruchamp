'use client';

import Image from 'next/image';
import { TextCard } from '@/components/cards/text-card';
import { ModeSwither } from '../mode-switcher';
import { useState } from 'react';
import { H4, H5, PersonDescriptionOnCard } from '../text';
import {
  calculateAge,
  getInitials,
  getRussianAgeWord,
  transformDate,
} from '@/lib/utils';
import { AthleteCard } from '../cards/athlete-card';
import {
  MedalWinner,
  TeamMember,
  TeamMemberWithResults,
} from '@/app/[lang]/(protected)/team/[id]/page';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { AllRegions, Country } from '@/lib/definitions';
import { Separator } from '../ui/separator';
import { Tag } from '../tag';

interface ResultsProps {
  goldenMedalWinners: MedalWinner[];
  silverMedalWinners: MedalWinner[];
  bronzeMedalWinners: MedalWinner[];
  athletes: TeamMemberWithResults[];
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
      {isMedalMode ? (
        <ul className="grid w-full grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-3">
          <WinnersList athletes={goldenMedalWinners} medal={'gold'} />
          <WinnersList athletes={silverMedalWinners} medal={'silver'} />
          <WinnersList athletes={bronzeMedalWinners} medal={'bronze'} />
        </ul>
      ) : (
        <AthleteListByPoints athletes={[]} />
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
        <PersonDescriptionOnCard className="mb-5 mr-auto text-base text-background">
          Нет спортсменов с этой наградой
        </PersonDescriptionOnCard>
      )}
    </li>
  );
}

function AthleteCardSmall({
  sirname,
  name,
  fathername,
  birthdate,
  gender,
  weight,
  image_field,
  country,
  region,
  city,
  event_name,
  match_name,
  event_location,
  start_datetime,
  sport_type,
}: Omit<MedalWinner, 'id' | 'height' | 'event_id' | 'match_id'>) {
  const athleteAge = calculateAge(birthdate);
  return (
    <TextCard className="hover:shadow-darkCardHover relative cursor-default flex-col gap-4 bg-card-backgroundDark transition-shadow duration-300 lg:px-4 lg:py-3">
      <div className="grid w-full grid-cols-[50px_1fr] gap-1">
        <Avatar className="row-span-2 h-10 w-10 text-foreground">
          <AvatarImage src={image_field} alt="" />
          <AvatarFallback className="text-base font-medium">
            {getInitials(name, sirname) || 'NA'}
          </AvatarFallback>
        </Avatar>
        <H4 className="text-white">
          {sirname} {name} {fathername}
        </H4>
        <div className="col-span-2 xl:col-span-1 xl:col-start-2">
          <PersonDescriptionOnCard>
            {city}, {AllRegions[region]}, {Country[country]}
          </PersonDescriptionOnCard>
          <PersonDescriptionOnCard>
            <b>{birthdate.split('-')[0]}</b> г.р.,{' '}
            <i>(возраст: {getRussianAgeWord(athleteAge)})</i>
          </PersonDescriptionOnCard>
          <PersonDescriptionOnCard>
            <b>Вес</b>: {weight} кг
          </PersonDescriptionOnCard>
        </div>
      </div>
      <Separator className="bg-neutralForeground3Rest" />
      <div className="flex flex-col gap-2">
        <PersonDescriptionOnCard className="text-neutralForeground3">
          <b>Мероприятие</b>: {event_name}, {event_location}
        </PersonDescriptionOnCard>
        <PersonDescriptionOnCard className="text-neutralForeground3">
          <b>Дата</b>: {transformDate(start_datetime)}
        </PersonDescriptionOnCard>
        {match_name && (
          <PersonDescriptionOnCard className="text-neutralForeground3">
            <b>Матч</b>: {match_name}
          </PersonDescriptionOnCard>
        )}
      </div>
      <div className="flex gap-3">
        <Tag>{sport_type}</Tag>
        <Tag variant={'transparentAccentBorder'}>{gender ? 'Муж' : 'Жен'}</Tag>
      </div>
    </TextCard>
  );
}

function AthleteListByPoints({
  athletes,
}: {
  athletes: WinnersListProps['athletes'];
}) {
  return (
    <ul>
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
        />
      ))}
    </ul>
  );
}
