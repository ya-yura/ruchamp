import { format } from 'date-fns';
import { H5 } from '../text';
import { Tag } from '../tag';
import { Button } from '../ui/button';
import { CustomLink } from '../custom-link';
import { cn } from '@/lib/utils';
import { Locale } from '@/i18n.config';

export interface MatchCardProps {
  matchId: number;
  eventId: string;
  date: string;
  matchType?: string;
  sportType: string;
  gender?: boolean;
  weightMin?: number;
  weightMax: number;
  buttonText?: string;
  athleteResult: string;
  lang: Locale;
}

export function MatchCard({
  matchType,
  eventId,
  matchId,
  date,
  sportType,
  gender,
  weightMin,
  weightMax,
  buttonText,
  athleteResult,
  lang,
}: MatchCardProps) {
  return (
    <li className="flex cursor-default flex-col gap-3 rounded-lg bg-card-background px-4 py-4">
      <div className="flex justify-between gap-7">
        <div className="flex">
          <H5 className="whitespace-nowrap text-xl font-semibold text-white">
            {date}
          </H5>
          <H5 className="ml-4 truncate text-xl font-normal text-neutralForeground3Rest">
            {matchType}
          </H5>
        </div>
        <div className="flex">
          <H5 className="mr-4 truncate text-xl font-normal text-neutralForeground3Rest">
            Мой результат:
          </H5>
          <H5 className="whitespace-nowrap text-xl font-semibold text-white">
            {athleteResult}
          </H5>
        </div>
      </div>
      <div className="flex flex-col justify-between gap-5 md:flex-row">
        <div className="flex flex-wrap gap-2">
          <Tag variant={'whiteGreyvBorder'}>{sportType}</Tag>
          <Tag variant={'transparentAccentBorder'}>
            {gender !== undefined ? (gender ? 'Муж' : 'Жен') : 'Пол не указан'}
          </Tag>

          <Tag variant={'transparentGrayBorder'}>до {weightMax} кг</Tag>

          {/* {grade && <Tag variant={'transparentGrayBorder'}>{grade}</Tag>} */}
        </div>

        <div>
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
              Турнирная сетка
            </CustomLink>
          )}
        </div>
      </div>
    </li>
  );
}
