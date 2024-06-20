import { ContentWraper } from '@/components/content-wraper';
import { ValueOption } from '../../../team/[id]/page';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { MatchCard } from '@/components/cards/match-card-athlete';
import { Locale } from '@/i18n.config';

interface Match {
  id: number;
  match_id: number;
  event_id: number;
  date: string;
  match_type: string;
  sport_type: string;
  weight_min: number;
  weight_max: number;
  gender: boolean;
  athlete_result: string;
}

interface MatchesFieldAthleteProps {
  eventId: string;
  matches: Match[];
  lang: Locale;
}

export default function MatchesFieldAthlete({
  eventId,
  matches,
  lang,
}: MatchesFieldAthleteProps) {
  return (
    <div className="rounded-lg bg-black p-3">
      <ul className="flex gap-3 ">
        {matches.map((match) => (
          <MatchCard
            key={match.id}
            eventId={eventId}
            matchId={match.id}
            matchType={match.match_type}
            date={match.date}
            sportType={match.sport_type}
            gender={match.gender}
            weightMin={match.weight_min}
            weightMax={match.weight_max}
            athleteResult={match.athlete_result}
            buttonText={'Турнирная сетка'}
            lang={lang}
          />
        ))}
      </ul>
    </div>
  );
}

// interface MatchesFieldProps {
//   eventId: string;
//   matches: Match[];
//   lang: Locale;
// }

// export default function MatchesField({ eventId, matches, lang }: MatchesFieldProps) {
//   return (
//     <div className="rounded-lg bg-black px-2 pb-2 pt-4">
//       <p className="mb-4 mr-auto text-base text-background">
//         {!!matches.length
//           ? `Всего матчей в этот день: ${matches.length}`
//           : 'Ничего не найдено'}
//       </p>
//       <ul className="flex flex-col gap-3 ">
//         {matches.map((match) => (
//           <MatchCard
//             key={match.id}
//             eventId={eventId}
//             matchId={match.id}
//             sportType={match.sport_name}
//             grade={match.category_type}
//             gender={match.gender}
//             weightClass={match.weight_category}
//             weightMin={match.weight_min}
//             weightMax={match.weight_max}
//             ageMin={match.age_min}
//             ageMax={match.age_max}
//             buttonText={'Турнирная сетка'}
//             lang={lang}
//           />
//         ))}
//       </ul>
//     </div>
//   );
// }
