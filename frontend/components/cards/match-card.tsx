import { format } from 'date-fns';
import { H5 } from '../text';
import { Tag } from '../tag';
import { Button } from '../ui/button';

export interface MatchCardProps {
  name?: string;
  startTime: string;
  endTime: string;
  sportType: string;
  grade: string;
  gender?: boolean;
  weightClass: string;
  buttonText?: string;
}

export function MatchCard({
  name,
  startTime,
  endTime,
  sportType,
  grade,
  gender,
  weightClass,
  buttonText,
}: MatchCardProps) {
  return (
    <li className="flex flex-col gap-3 rounded-lg bg-card-background px-4 py-4 cursor-default">
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
          {weightClass && (
            <Tag variant={'transparentGrayBorder'}>{weightClass}</Tag>
          )}
          {grade && <Tag variant={'transparentGrayBorder'}>{grade}</Tag>}
        </div>
        {buttonText && (
          <Button
            className="mt-0 w-fit md:-mt-2"
            variant={'ruchampDefault'}
            size={'sm'}
          >
            {buttonText}
          </Button>
        )}
      </div>
    </li>
  );
}
