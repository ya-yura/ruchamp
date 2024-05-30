import { ContentWraper } from '@/components/content-wraper';
import { EventMatch } from './page';
import { MatchCard } from '@/components/cards/match-card';

export function MatchesEvent({ matches }: { matches: EventMatch[] }) {
  return (
    <ContentWraper className="min-h-44">
      <p className="mb-5 mr-auto text-base text-background">
        {!!matches.length
          ? `Найдено матчей: ${matches.length}`
          : 'Ничего не найдено'}
      </p>
      {!!matches.length && <MatchesField matches={matches} />}
    </ContentWraper>
  );
}

function MatchesField({ matches }: { matches: EventMatch[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {matches.map((match) => (
        <MatchCard
          key={match.id}
          startTime={match.start_datetime}
          endTime={match.end_datetime}
          sportType={match.sport_name}
          grade={match.category_type}
          gender={match.gender}
          weightClass={match.weight_category}
          buttonText={'Турнирная сетка'}
        />
      ))}
    </ul>
  );
}
