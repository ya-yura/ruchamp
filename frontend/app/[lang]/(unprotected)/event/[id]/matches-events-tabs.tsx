import { ContentWraper } from '@/components/content-wraper';
import { ValueOption } from '../../team/[id]/page';
import { EventMatch } from './page';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { MatchCard } from '@/components/cards/match-card';

interface MatchesEventTabsProps {
  matches: EventMatch[];
  matchDates: ValueOption[];
  value: string;
  handleTabChange: ((value: string) => void) | undefined;
  isOwner?: boolean;
}

export function MatchesEventTabs({
  matches,
  matchDates,
  value,
  handleTabChange,
  isOwner,
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
            {!!matches.length && <MatchesField matches={matches} />}
          </TabsContent>
        ))}
      </Tabs>
    </ContentWraper>
  );
}

function MatchesField({ matches }: { matches: EventMatch[] }) {
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
    </div>
  );
}
