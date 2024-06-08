import { ContentWraper } from '@/components/content-wraper';
import { Tag } from '@/components/tag';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { H4, PersonDescriptionOnCard } from '@/components/text';
import { format } from 'date-fns';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  calculateAge,
  getRussianAgeWord,
  transformDate,
} from '@/lib/utils/date-and-time';
import { TextCard } from '@/components/cards/text-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils/text-utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { BackButton } from '@/components/back-button';
import { GridInfo, GridPlayer, GridRound } from './page';

interface GridProps {
  info: GridInfo;
  rounds: GridRound[];
}


export function Grid({ info, rounds }: GridProps) {
  return (
    <ContentWraper className="min-h-44">
      {info.start_time && info.match_name && (
        <div className="mb-4 flex">
          {info.start_time && (
            <H4 className="mr-4">{transformDate(info.start_time, true)}</H4>
          )}
          {info.match_name && (
            <H4 className="text-Grey101 font-normal">{info.sport_name}</H4>
          )}
          <BackButton className="ml-auto" />
        </div>
      )}
      <div className="mb-12 flex gap-2">
        <Tag variant={'transparentAccentBorder'}>
          {info.gender ? 'Муж' : 'Жен'}
        </Tag>
        {info.age_from && info.age_till && (
          <Tag variant={'transparentGrayBorder'}>
            {info.age_from} – {info.age_till} лет
          </Tag>
        )}

        <Tag variant={'transparentGrayBorder'}>
          {info.weight_category}: от {info.weight_min} кг до {info.weight_max}{' '}
          кг
        </Tag>
        <Tag variant={'transparentGrayBorder'}>{info.method}</Tag>
      </div>
      <GridField rounds={rounds} />
    </ContentWraper>
  );
}

function GridField({ rounds }: { rounds: GridRound[] }) {
  const colVariants: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-[repeat(2,_2fr)]',
    3: 'grid-cols-[repeat(1,_2fr)_1fr_1fr]',
    4: 'grid-cols-[repeat(2,_2fr)_1fr_1fr]',
    5: 'grid-cols-[repeat(3,_2fr)_1fr_1fr]',
    6: 'grid-cols-[repeat(4,_2fr)_1fr_1fr]',
    7: 'grid-cols-[repeat(5,_2fr)_1fr_1fr]',
  };
  const mtVariants: Record<string, string> = {
    0: 'mt-[0]',
    1: 'mt-[36px]',
    2: 'mt-[90px]',
    3: 'mt-[198px]',
    4: 'mt-[414px]',
    5: 'mt-[846px]',
    6: 'mt-[846px]',
  };

  return (
    <ScrollArea className="-mx-4 w-screen sm:mx-0 sm:w-full">
      <div className="flex w-[1300px] flex-col gap-5 xl:w-full">
        <ul className={cn('grid', colVariants[rounds.length])}>
          {rounds.map((round, index) => (
            <li key={round.name}>
              {index === rounds.length - 1 || index === rounds.length - 2 ? (
                index === rounds.length - 1 ? (
                  <Image
                    className="mx-auto h-10 w-10"
                    src={`/images/medals/gold.svg`}
                    alt=""
                    width={213}
                    height={241}
                  />
                ) : (
                  <Image
                    className="mx-auto h-10 w-10"
                    src={`/images/medals/bronze.svg`}
                    alt=""
                    width={213}
                    height={241}
                  />
                )
              ) : (
                <p className="text-center text-4xl font-bold text-card-background">
                  {round.name}
                </p>
              )}
            </li>
          ))}
        </ul>
        <ul
          className={cn(
            'grid rounded-lg bg-black p-4',
            colVariants[rounds.length],
          )}
        >
          {rounds.map((round, index) => (
            <ul
              key={round.name}
              className={cn(
                index === rounds.length - 1
                  ? mtVariants[index - 1]
                  : mtVariants[index],
              )}
            >
              {round.fights.map((fight) => (
                <GridCard
                  key={fight.fight_info.fight_id}
                  time={fight.fight_info.start_time}
                  mat_number={fight.fight_info.mat_number}
                  player_1={fight.player_1}
                  player_2={fight.player_2}
                  isFirstCol={index === 0}
                  isLastCol={index === rounds.length - 1}
                  isPreLastCol={index === rounds.length - 2}
                  roundIndex={index}
                />
              ))}
            </ul>
          ))}
        </ul>
      </div>
      <ScrollBar className="hidden" orientation="horizontal" />
    </ScrollArea>
  );
}

interface GridCardProps {
  time: string;
  mat_number: number;
  player_1: GridPlayer;
  player_2: GridPlayer;
  isFirstCol?: boolean;
  isLastCol?: boolean;
  isPreLastCol?: boolean;
  roundIndex: number;
  className?: string;
}

export function GridCard({
  time,
  mat_number,
  player_1,
  player_2,
  isFirstCol,
  isLastCol,
  isPreLastCol,
  roundIndex,
  className,
}: GridCardProps) {
  const isPlayerFirstWinner = player_1.points > player_2.points;
  const isDraw = player_1.points === player_2.points;
  const arrowHeight: Record<string, string> = {
    0: 'h-[0]',
    1: 'h-[18px]',
    2: 'h-[72px]',
    3: 'h-[180px]',
    4: 'h-[396px]',
    5: 'h-[828px]',
    6: 'h-[828px]',
  };
  const spaceHeight: Record<string, string> = {
    0: 'h-[36px]',
    1: 'h-[108px]',
    2: 'h-[216px]',
    3: 'h-[432px]',
    4: 'h-[864px]',
    5: 'h-[0]',
    6: 'h-[0]',
  };

  return (
    <li className={cn('group grid cursor-default', 'grid-cols-[135px_1fr]')}>
      <div className={cn('flex flex-col')}>
        {!isFirstCol && (
          <>
            <div
              className={cn(
                'border-Grey102 relative order-first w-1/2 rounded-e-md border-e border-t border-dashed',
                isLastCol
                  ? 'relative bottom-0 right-[90%] w-[calc(100%+40%)]'
                  : '',
                isLastCol
                  ? arrowHeight[roundIndex - 1]
                  : arrowHeight[roundIndex],
              )}
            >
              <Image
                className={cn('absolute bottom-[-1px] right-[-6px] h-3 w-3')}
                src={'/ru/images/icons/triangle.svg'}
                alt=""
                width={10}
                height={10}
              />
            </div>
            <div
              className={cn(
                'border-Grey102 relative order-last w-1/2 rounded-e-md border-b border-e border-dashed',
                isLastCol
                  ? 'relative bottom-0 right-[90%] w-[calc(100%+40%)]'
                  : '',
                isLastCol
                  ? arrowHeight[roundIndex - 1]
                  : arrowHeight[roundIndex],
              )}
            >
              <Image
                className={cn(
                  'absolute right-[-6px] top-[-1px] h-3 w-3 rotate-180',
                )}
                src={'/ru/images/icons/triangle.svg'}
                alt=""
                width={10}
                height={10}
              />
            </div>
          </>
        )}
        <div
          className={cn(
            'relative flex h-[72px] justify-between rounded-lg bg-card-background px-3 py-2',
            isPreLastCol ? '-ml-2 mr-2' : '',
            className,
          )}
        >
          <div>
            <H4>{format(time, 'HH:mm')}</H4>
            <p className="text-ColorsGrey26 text-nowrap text-sm">
              Мат № {mat_number}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <GridCardPlayerId
              player={player_1}
              isWinner={isPlayerFirstWinner && !isDraw}
            />
            <GridCardPlayerId
              player={player_2}
              isWinner={!isPlayerFirstWinner && !isDraw}
            />
          </div>
        </div>
      </div>
      {!(isLastCol || isPreLastCol) && (
        <div className="relative flex h-1/2 w-full items-end">
          <div className="border-Grey102 w-full border-b border-dashed"></div>
          <p className="relative bottom-[-8px] mt-[10px] text-nowrap px-1 text-xs font-semibold text-text-muted">
            <span
              className={cn(isPlayerFirstWinner && !isDraw ? 'text-white' : '')}
            >
              {player_1.points}
            </span>{' '}
            :{' '}
            <span
              className={cn(
                !isPlayerFirstWinner && !isDraw ? 'text-white' : '',
              )}
            >
              {player_2.points}
            </span>
          </p>
        </div>
      )}
      <div
        className={cn(
          'group-last:h-0',
          isLastCol ? spaceHeight[roundIndex - 1] : spaceHeight[roundIndex],
        )}
      ></div>
    </li>
  );
}

function GridCardPlayerId({
  player,
  isWinner,
}: {
  player: GridPlayer;
  isWinner: boolean;
}) {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <div
          className={cn(
            'bg-Grey100 relative flex justify-center rounded-md p-[6px]',
            player.first_name ? 'cursor-pointer' : '',
          )}
        >
          {isWinner && (
            <Image
              className="absolute left-0 top-[calc(50%-5px)]"
              src={'/images/icons/winner-marker.svg'}
              alt=""
              width={2}
              height={10}
            />
          )}
          <p className="text-Grey101 text-[10px] font-semibold">
            {player.player_id}
          </p>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-auto rounded-lg border-none bg-transparent p-0">
        {player.first_name && (
          <AthleteSmallCard
            id={player.player_id}
            sirname={player.last_name}
            name={player.first_name}
            birthdate={player.birthdate}
            image_field={''} // add later
            points={player.points}
            team_id={player.team_id}
            team_name={player.team_name}
          />
        )}
      </HoverCardContent>
    </HoverCard>
  );
}

interface AthleteSmallCardProps {
  id: number;
  name: string | null;
  sirname: string | null;
  image_field: string;
  birthdate: string | null;
  team_name: string | null;
  team_id: number;
  points: number;
}

function AthleteSmallCard({
  id,
  name,
  sirname,
  image_field,
  birthdate,
  team_name,
  team_id,
  points,
}: AthleteSmallCardProps) {
  if (!name && !birthdate) {
    return;
  }
  const athleteAge = birthdate ? calculateAge(birthdate) : 0;
  return (
    <TextCard className="relative cursor-default flex-col gap-4 shadow-cardShadow transition-colors sm:flex-row lg:px-4 lg:py-3">
      <div className="flex w-full flex-row-reverse justify-between gap-4 sm:w-2/3 sm:flex-row sm:justify-start xl:items-center">
        <div className="relative h-14 w-14 sm:h-10 sm:w-10">
          <Avatar className="h-14 w-14 text-foreground sm:h-10 sm:w-10">
            <AvatarImage src={image_field} alt="" />
            <AvatarFallback className="text-base font-medium">
              {name && sirname ? getInitials(name, sirname) : ''}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col">
          <H4 className="text-white">
            {id} {sirname} {name}
          </H4>
          <PersonDescriptionOnCard className="text-neutralForeground3">
            {birthdate ? (
              <>
                <b>{birthdate.split('-')[0]}</b> г.р.,{' '}
                <i>(возраст: {getRussianAgeWord(athleteAge)})</i>
              </>
            ) : (
              <i>возраст не указан</i>
            )}
          </PersonDescriptionOnCard>
        </div>
      </div>
      <div className="w-full sm:w-1/3">
        <PersonDescriptionOnCard className="text-neutralForeground3">
          <b>Очков: {points}</b>
        </PersonDescriptionOnCard>
        <PersonDescriptionOnCard className="text-neutralForeground3">
          <b>Команда: {team_name}</b>
        </PersonDescriptionOnCard>
      </div>
    </TextCard>
  );
}
