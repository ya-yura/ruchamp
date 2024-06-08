import { ContentWraper } from '@/components/content-wraper';
import { ValueOption } from '../../../team/[id]/page';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { MatchCard } from '@/components/cards/match-card';
import { Locale } from '@/i18n.config';
import { EventMatch } from './matches-event';

interface MatchesEventTabsProps {
  eventId: string;
  matches: EventMatch[];
  matchDates: ValueOption[];
  value: string;
  handleTabChange: ((value: string) => void) | undefined;
  isOwner?: boolean;
  lang: Locale;
}

export function MatchesEventTabs({
  eventId,
  matches,
  matchDates,
  value,
  handleTabChange,
  isOwner,
  lang,
}: MatchesEventTabsProps) {
  return (
    <ContentWraper className="min-h-44">
      <Tabs
        defaultValue={matchDates[0].value as string}
        className="w-full"
        onValueChange={handleTabChange}
        value={value}
      >
        <ScrollArea className="-mx-4 w-screen sm:mx-0 sm:w-full">
          <TabsList className="flex w-fit justify-between bg-transparent text-text-mutedLight">
            {matchDates.map((date) => (
              <TabsTrigger
                key={date.value as string}
                className={cn(
                  'group',
                  'first-of-type:ml-4 last-of-type:mr-4',
                  'sm:first-of-type:ml-0 sm:last-of-type:mr-0',
                )}
                value={date.displayedValue as string}
              >
                <div className='mr-2 h-5 w-5 bg-[url("/images/icons/calendar.svg")] group-data-[state=active]:bg-[url("/images/icons/calendar-filled.svg")]'></div>
                {date.displayedValue}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar className="hidden" orientation="horizontal" />
        </ScrollArea>
        {matchDates.map((date) => (
          <TabsContent
            className="mt-0"
            key={date.value as string}
            value={date.displayedValue as string}
          >
            {!!matches.length && (
              <MatchesField eventId={eventId} matches={matches} lang={lang} />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </ContentWraper>
  );
}

interface MatchesFieldPops {
  eventId: string;
  matches: EventMatch[];
  lang: Locale;
}

function MatchesField({ eventId, matches, lang }: MatchesFieldPops) {
  return (
    <div className="rounded-lg bg-black px-2 pb-2 pt-4">
      <p className="mb-4 mr-auto text-base text-background">
        {!!matches.length
          ? `Всего матчей в этот день: ${matches.length}`
          : 'Ничего не найдено'}
      </p>
      <ul className="flex flex-col gap-3 ">
        {matches.map((match) => (
          <MatchCard
            key={match.id}
            eventId={eventId}
            matchId={match.id}
            startTime={match.start_datetime}
            endTime={match.end_datetime}
            sportType={match.sport_name}
            grade={match.category_type}
            gender={match.gender}
            weightClass={match.weight_category}
            ageMin={match.age_min}
            ageMax={match.age_max}
            buttonText={'Турнирная сетка'}
            lang={lang}
          />
        ))}
      </ul>
    </div>
  );
}
