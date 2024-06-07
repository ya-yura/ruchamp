import { format } from 'date-fns';
import { H5 } from '../text';
import { Tag } from '../tag';
import { Button } from '../ui/button';
import { CustomLink } from '../custom-link';
import { cn } from '@/lib/utils';
import { Locale } from '@/i18n.config';

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
  buttonText?: string;
  ageMin: number;
  ageMax: number;
  lang: Locale;
}

export function MatchCard({
  name,
  eventId,
  matchId,
  startTime,
  endTime,
  sportType,
  grade,
  gender,
  weightClass,
  buttonText,
  ageMin,
  ageMax,
  lang,
}: MatchCardProps) {
  return (
    <li className="flex cursor-default flex-col gap-3 rounded-lg bg-card-background px-4 py-4">
      <div className="flex gap-7">
        <H5 className="whitespace-nowrap text-xl font-semibold text-white">
          {format(startTime, 'HH:mm')} – {format(endTime, 'HH:mm')}
        </H5>
        <H5 className="truncate text-xl font-normal text-neutralForeground3Rest">
          {sportType}
        </H5>
      </div>
      <div className="flex flex-col justify-between gap-5 md:flex-row">
        <div className="flex flex-wrap gap-2">
          {/* <Tag>{sportType}</Tag> */}
          <Tag variant={'transparentAccentBorder'}>
            {gender !== undefined ? (gender ? 'Муж' : 'Жен') : 'Пол не указан'}
          </Tag>
          {ageMin && ageMax && (
            <Tag variant={'transparentGrayBorder'}>
              {ageMin} – {ageMax} лет
            </Tag>
          )}
          {weightClass && (
            <Tag variant={'transparentGrayBorder'}>{weightClass}</Tag>
          )}
          {grade && <Tag variant={'transparentGrayBorder'}>{grade}</Tag>}
        </div>
        {buttonText && (
          <CustomLink
            className={cn(
              'h-10 bg-primary-mainAccent px-4 py-2 text-base font-semibold text-primary-foreground hover:bg-primary-mainAccent/90',
              'inline-flex items-center justify-center whitespace-nowrap rounded-md ring-offset-background',
              'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            )}
            lang={lang}
            href={`/event/${eventId}/matches/${matchId}`}
          >
            Подробнее
          </CustomLink>
        )}
      </div>
    </li>
  );
}
