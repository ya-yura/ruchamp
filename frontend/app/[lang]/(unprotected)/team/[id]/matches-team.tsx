'use client';

import { ContentWraper } from '@/components/content-wraper';
import { Locale } from '@/i18n.config';
import { GroupedMatch, TeamMatch } from './page';
import { H4 } from '@/components/text';
import { MatchCard } from '@/components/cards/match-card';

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
      {length && <MatchesField groupedMatches={groupedMatches} lang={lang} />}
    </ContentWraper>
  );
}

export function MatchesField({
  groupedMatches,
  lang,
}: {
  groupedMatches: GroupedMatch[];
  lang: Locale;
}) {
  return (
    <ul className="flex flex-col gap-10 bg-black px-4 py-8">
      {groupedMatches.map((group) => (
        <li className="flex flex-col gap-3" key={group.event_id}>
          <div className="flex gap-2">
            <H4 className="max-w-[35%] truncate">
              {group.name.endsWith('.') ? group.name.slice(0, -1) : group.name}
            </H4>

            <H4 className="font-normal">– {group.start_datetime}.</H4>
            <H4 className="max-w-[35%] truncate font-light text-neutralForeground3Rest">
              {group.location}
            </H4>
          </div>
          <MatchesList matches={group.matches} lang={lang} />
        </li>
      ))}
    </ul>
  );
}

export function MatchesList({
  matches,
  lang,
}: {
  matches: TeamMatch[];
  lang: Locale;
}) {
  return (
    <ul className="flex flex-col gap-3">
      {matches.map((match) => (
        <MatchCard
          eventId={match.event_id.toString()}
          matchId={match.match_id}
          key={match.match_id}
          startTime={match.start_datetime}
          endTime={match.end_datetime}
          sportType={match.sport_type}
          grade={match.grade}
          gender={match.gender || false}
          weightClass={match.weight_class}
          ageMin={match.age_min}
          ageMax={match.age_max}
          buttonText={'Результаты'}
          lang={lang}
        />
      ))}
    </ul>
  );
}
