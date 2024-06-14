'use client';
import { MedalWinner } from '@/app/[lang]/(unprotected)/team/[id]/page';
import { useState } from 'react';
import { TextCard } from './text-card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { H4, PersonDescriptionOnCard } from '../text';
import { AllRegions, Country } from '@/lib/definitions';
import { Separator } from '../ui/separator';
import { Tag } from '../tag';
import {
  calculateAge,
  getRussianAgeWord,
  transformDate,
} from '@/lib/utils/date-and-time';
import { getInitials } from '@/lib/utils/text-utils';
import Counter from '../counter';

export interface AthleteCardSmall {
  id?: number;
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
  event_id?: number;
  event_name?: string;
  match_id?: number;
  match_name?: string;
  event_location?: string;
  start_datetime?: string;
  sport_type?: string;
  isWithEvent?: boolean;
}

export function AthleteCardSmall({
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
  isWithEvent,
}: AthleteCardSmall) {
  const athleteAge = calculateAge(birthdate);
  return (
    <TextCard className="relative cursor-default flex-col gap-4 bg-card-backgroundDark transition-shadow duration-300 hover:shadow-darkCardHover lg:px-4 lg:py-3">
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
        <Counter />
      </div>
      {isWithEvent && (
        <>
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
            <Tag variant={'transparentAccentBorder'}>
              {gender ? 'Муж' : 'Жен'}
            </Tag>
          </div>
        </>
      )}
    </TextCard>
  );
}
