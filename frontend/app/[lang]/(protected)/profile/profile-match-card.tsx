'use client';

import React from 'react';
import { Locale } from '@/i18n.config';
import { transformDate } from '@/lib/utils/date-and-time';
import { H5 } from '@/components/text';
import { Tag } from '@/components/tag';
import { Marker } from '../../(unprotected)/event/[id]/(owner)/applications/marker';
import { ApplicationRejectButton } from '@/components/buttons/reject-application-button';

export interface ProfileMatchCardProps {
  token?: string;
  name?: string;
  eventId: string | number;
  eventName: string;
  matchId: number;
  matchName: string;
  applicationId: number;
  startTime: string;
  sportType: string;
  grade: string;
  gender?: boolean;
  weightClass: string;
  weightMin: number;
  weightMax: number;
  buttonText?: string;
  ageMin: number;
  ageMax: number;
  result?: string;
  status: string;
  lang: Locale;
  color:
    | 'greenTransparent'
    | 'darkRedSolid'
    | 'greenSolid'
    | 'blueTransparent'
    | null
    | undefined;
  text: string;
}

export function ProfileMatchCard({
  token,
  name,
  eventId,
  eventName,
  matchId,
  matchName,
  applicationId,
  startTime,
  sportType,
  grade,
  gender,
  weightClass,
  weightMin,
  weightMax,
  buttonText,
  ageMin,
  ageMax,
  result,
  status,
  color,
  text,
  lang,
}: ProfileMatchCardProps) {
  return (
    <li className="flex cursor-default flex-col gap-3 rounded-lg bg-card-background px-4 py-4">
      {/* <H5 className="whitespace-nowrap text-xl font-normal text-white">
        {eventName}
      </H5> */}
      <div className="flex justify-between">
        <div className="flex gap-7">
          <H5 className="whitespace-nowrap text-xl font-semibold text-white">
            {transformDate(startTime)}
          </H5>
          <H5 className="truncate text-xl font-normal text-neutralForeground3Rest">
            {matchName}
          </H5>
        </div>
        <Marker variant={color} children={text} />
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col justify-between gap-5 md:flex-row">
          <div className="flex flex-wrap gap-2">
            <Tag variant={'transparentAccentBorder'}>
              {gender !== undefined
                ? gender
                  ? 'Муж'
                  : 'Жен'
                : 'Пол не указан'}
            </Tag>
            {ageMax !== 0 && (
              <Tag variant={'transparentGrayBorder'}>
                {ageMin} – {ageMax} лет
              </Tag>
            )}
            {weightClass && (
              <Tag variant={'transparentGrayBorder'}>
                {weightClass}: от {weightMin} кг до {weightMax} кг
              </Tag>
            )}
            {grade && <Tag variant={'transparentGrayBorder'}>{grade}</Tag>}
          </div>
        </div>
        {status === 'accepted' && (
          <ApplicationRejectButton
            token={token}
            applicationId={applicationId}
          />
        )}
      </div>
    </li>
  );
}
