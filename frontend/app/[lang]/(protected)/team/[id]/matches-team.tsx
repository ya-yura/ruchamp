'use client';

import { ContentWraper } from '@/components/content-wraper';
import { Locale } from '@/i18n.config';
import { GroupedMatch, TeamMatch } from './page';
import { H4, H5 } from '@/components/text';
import { Button } from '@/components/ui/button';
import { Tag } from '@/components/tag';
import { format } from 'date-fns';

interface MatchesTeamProps {
  groupedMatches: GroupedMatch[];
  length: number;
  lang: Locale;
}

export function MatchesTeam({
  groupedMatches,
  length,
  lang,
}: MatchesTeamProps) {
  return (
    <ContentWraper>
      <p className="mb-5 mr-auto text-base text-background">
        {!!length ? `Найдено матчей: ${length}` : 'Ничего не найдено'}
      </p>
      {length && <MatchesField groupedMatches={groupedMatches} />}
    </ContentWraper>
  );
}

export function MatchesField({
  groupedMatches,
}: {
  groupedMatches: GroupedMatch[];
}) {
  return (
    <ul className="flex flex-col gap-10 bg-black px-4 py-8">
      {groupedMatches.map((group) => (
        <li className="flex flex-col gap-3" key={group.event_id}>
          <H4>
            {group.start_datetime}, {group.name}, {group.location}
          </H4>
          <MatchesList matches={group.matches} />
        </li>
      ))}
    </ul>
  );
}

export function MatchesList({ matches }: { matches: TeamMatch[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {matches.map((match) => (
        <MatchCard
          key={match.match_id}
          name={match.name}
          startTime={match.start_datetime}
          endTime={match.end_datetime}
          sportType={match.sport_type}
          grade={match.grade}
          gender={match.gender || false}
          weightClass={match.weight_class}
        />
      ))}
    </ul>
  );
}

interface MatchCardProps {
  name: string;
  startTime: string;
  endTime: string;
  sportType: string;
  grade: string;
  gender?: boolean;
  weightClass: string;
}

export function MatchCard({
  name,
  startTime,
  endTime,
  sportType,
  grade,
  gender,
  weightClass,
}: MatchCardProps) {
  return (
    <li className="flex flex-col gap-3 rounded-lg bg-card-background px-4 py-4">
      <div className="flex gap-7">
        <H5 className="whitespace-nowrap text-xl font-semibold text-white">
          {format(startTime, 'HH:mm')} – {format(endTime, 'HH:mm')}
        </H5>
        <H5 className="truncate text-xl font-normal text-neutralForeground3Rest">
          {name}
        </H5>
      </div>
      <div className="flex flex-col justify-between gap-5 md:flex-row">
        <div className="flex flex-wrap gap-2">
          <Tag>{sportType}</Tag>
          <Tag variant={'transparentAccentBorder'}>
            {gender ? gender : 'Пол не указан'}
          </Tag>
          <Tag variant={'transparentGrayBorder'}>{weightClass}</Tag>
          <Tag variant={'transparentGrayBorder'}>{grade}</Tag>
        </div>
        <Button
          className="mt-0 w-fit md:-mt-2"
          variant={'ruchampDefault'}
          size={'sm'}
        >
          Результаты
        </Button>
      </div>
    </li>
  );
}
