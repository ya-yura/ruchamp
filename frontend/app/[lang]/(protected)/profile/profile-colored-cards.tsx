'use client';

import {
  TextCardColored,
  TextCardColoredProps,
} from '@/components/cards/text-card-colored';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserInfo } from '@/lib/definitions';
import { transformDate } from '@/lib/utils/date-and-time';
import React, { useState } from 'react';

interface ProfileColoredCardsProps {
  birthdate: string;
  weight: number;
  grades: UserInfo['roleInfo']['grades'];
  achievements: UserInfo['roleInfo']['achievements'];
}

export function ProfileColoredCards({
  weight,
  birthdate,
  grades,
  achievements,
}: ProfileColoredCardsProps) {
  const [grade, setGrade] = useState<string>(Object.keys(grades)[0]);
  const [achievement, setAchievement] = useState<string>(
    Object.keys(achievements)[0],
  );
  const textCardsData: TextCardColoredProps[] = [
    {
      title: `${weight} кг`,
      text: 'Мой вес',
      className: 'bg-pistachio',
      titleStyles: 'text-ColorsGrey14 font-black',
      textStyles: 'text-ColorsGrey26',
    },
    {
      title: transformDate(birthdate),
      text: 'Дата моего рождения',
      className: 'bg-orange',
      titleStyles: 'text-ColorsGrey14 font-black',
      textStyles: 'text-ColorsGrey26',
    },
  ];

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-black px-6 py-7">
      <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {textCardsData.map((card) => (
          <TextCardColored
            key={card.title}
            title={card.title}
            text={card.text}
            className={card.className}
            titleStyles={card.titleStyles}
            textStyles={card.textStyles}
          />
        ))}
        <li className="flex flex-col items-start rounded-lg bg-purple p-5">
          <h4 className="mb-3 text-lg font-black text-ColorsGrey98">
            {grades[grade]}
          </h4>
          <Select
            onValueChange={(data) => setGrade(data)}
            defaultValue={Object.keys(grades)[0]}
          >
            <SelectTrigger className="w-fit space-x-2 whitespace-pre-line border-none bg-transparent p-0 text-sm text-ColorsGrey98 shadow-none focus:shadow-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(grades).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </li>
        <li className="flex flex-col items-start rounded-lg bg-neutralForeground3 p-5">
          <h4 className="mb-3 text-lg font-black text-ColorsGrey98">
            <span className="text-gold1">
              {achievements[achievement].gold} шт
            </span>
            ,{' '}
            <span className="text-silver1">
              {achievements[achievement].silver} шт
            </span>
            ,{' '}
            <span className="text-bronze1">
              {achievements[achievement].bronze} шт
            </span>
          </h4>
          <Select
            onValueChange={(data) => setAchievement(data)}
            defaultValue={Object.keys(achievements)[0]}
          >
            <SelectTrigger className="w-fit space-x-2 whitespace-pre-line border-none bg-transparent p-0 text-sm text-ColorsGrey98 shadow-none focus:shadow-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(achievements).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </li>
      </ul>
    </div>
  );
}
