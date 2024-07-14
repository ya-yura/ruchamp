import { format, isAfter } from 'date-fns';
import { H5 } from '../text';
import { Tag } from '../tag';
import { CustomLink } from '../custom-link';
import { cn } from '@/lib/utils';
import { Locale } from '@/i18n.config';
import { ValueOption } from '@/app/[lang]/(unprotected)/team/[id]/page';
import { ApplicationCreateButton } from '../buttons/create-application-button';

export interface MatchCardProps {
  name?: string;
  eventId: string;
  matchId: number;
  startTime: string;
  endTime: string;
  sportType: string;
  grade: string;
  gender?: boolean;
  weightClass: string;
  weightMin: number;
  weightMax: number;
  buttonText?: string;
  ageMin: number;
  ageMax: number;
  lang: Locale;
  regEnd?: ValueOption;
}

export interface MatchCardProps {
  token?: string;
  name?: string;
  eventId: string;
  userId?: number;
  matchId: number;
  startTime: string;
  endTime: string;
  sportType: string;
  grade: string;
  gender?: boolean;
  weightClass: string;
  weightMin: number;
  weightMax: number;
  buttonText?: string;
  ageMin: number;
  ageMax: number;
  lang: Locale;
  regEnd?: ValueOption;
  isAthlete?: boolean;
  isOwner?: boolean;
}

export function MatchCard({
  token,
  name,
  eventId,
  userId,
  matchId,
  startTime,
  endTime,
  sportType,
  grade,
  gender,
  weightClass,
  weightMin,
  weightMax,
  buttonText,
  ageMin,
  ageMax,
  lang,
  regEnd,
  isAthlete,
  isOwner,
}: MatchCardProps) {
  // проверяем, закончилась ли регистрация на матч
  const isRegOver = (date: string): boolean => {
    return isAfter(new Date(), new Date(date));
  };

  const regStatus = regEnd ? isRegOver(regEnd.value as string) : false;

  return (
    <li className="flex cursor-default flex-col gap-3 rounded-lg bg-card-background px-4 py-4">
      <div className="flex gap-7">
        <H5 className="whitespace-nowrap text-xl font-semibold text-white">
          {format(new Date(startTime), 'HH:mm')} –{' '}
          {format(new Date(endTime), 'HH:mm')}
        </H5>
        <H5 className="truncate text-xl font-normal text-neutralForeground3Rest">
          {sportType}
        </H5>
      </div>
      <div className="flex flex-col justify-between gap-5 md:flex-row">
        <div className="flex flex-wrap gap-2">
          <Tag variant={'transparentAccentBorder'}>
            {gender !== undefined ? (gender ? 'Муж' : 'Жен') : 'Пол не указан'}
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
        {regStatus || isOwner
          ? buttonText && (
              <CustomLink
                className={cn(
                  'h-10 bg-primary-mainAccent px-4 py-2 text-base font-semibold text-primary-foreground hover:bg-primary-mainAccent/90',
                  'inline-flex items-center justify-center whitespace-nowrap rounded-md ring-offset-background',
                  'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                )}
                lang={lang}
                href={`/event/${eventId}/matches/${matchId}`}
              >
                {buttonText}
              </CustomLink>
            )
          : isAthlete && (
              <ApplicationCreateButton token={token} matchId={matchId} />
            )}
      </div>
    </li>
  );
}
