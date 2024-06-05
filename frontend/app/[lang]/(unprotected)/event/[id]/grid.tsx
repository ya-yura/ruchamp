import { ContentWraper } from '@/components/content-wraper';
import { GridInfo, GridPlayer, GridRound } from './page';
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
import { AthleteCard } from '@/components/cards/athlete-card';
import { calculateAge, getRussianAgeWord } from '@/lib/utils/date-and-time';
import { TextCard } from '@/components/cards/text-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils/text-utils';

interface GridProps {
  info: GridInfo;
  rounds: GridRound[];
}

export function Grid({ info, rounds }: GridProps) {
  return (
    <ContentWraper className="min-h-44 gap-12">
      <div className="flex gap-2">
        <Tag variant={'default'}>{info.sport_name}</Tag>
        <Tag variant={'transparentAccentBorder'}>{info.gender}</Tag>
        <Tag variant={'transparentGrayBorder'}>{info.weight_category}</Tag>
        <Tag variant={'transparentGrayBorder'}>{info.method}</Tag>
      </div>
      <GridField rounds={rounds} />
    </ContentWraper>
  );
}

function GridField({ rounds }: { rounds: GridRound[] }) {
  const colVariants: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-[repeat(2,_1fr)]',
    3: 'grid-cols-[repeat(3,_1fr)]',
    4: 'grid-cols-[repeat(4,_1fr)]',
    5: 'grid-cols-[repeat(5,_1fr)]',
    6: 'grid-cols-[repeat(6,_1fr)]',
  };
  const mtVariants: Record<string, string> = {
    0: 'mt-[0]',
    1: 'mt-[36px]',
    2: 'mt-[90px]',
    3: 'mt-[198px]',
    4: 'mt-[414px]',
    5: 'mt-[846px]',
  };

  return (
    <div className="flex flex-col gap-5">
      <ul className={cn('grid', colVariants[rounds.length])}>
        {rounds.map((round) => (
          <li key={round.name}>
            <p className="text-center text-4xl font-bold text-card-background">
              {round.name}
            </p>
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
              mtVariants[index],
              index === rounds.length - 1 ? 'flex' : '',
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
                roundIndex={index}
              />
            ))}
          </ul>
        ))}
      </ul>
    </div>
  );
}

interface GridCardProps {
  time: string;
  mat_number: number;
  player_1: GridPlayer;
  player_2: GridPlayer;
  isFirstCol?: boolean;
  isLastCol?: boolean;
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
  };
  const spaceHeight: Record<string, string> = {
    0: 'h-[36px]',
    1: 'h-[108px]',
    2: 'h-[216px]',
    3: 'h-[432px]',
    4: 'h-[864px]',
    5: 'h-[0]',
  };

  return (
    <li className={cn('group grid cursor-default', 'grid-cols-[122px_1fr]')}>
      <div className={cn('flex flex-col')}>
        {!isFirstCol && (
          <>
            <div
              className={cn(
                'border-Grey102 relative order-first rounded-e-md border-e border-t border-dashed',
                isLastCol ? 'w-full group-last:border-none' : 'w-1/2',
                arrowHeight[roundIndex],
              )}
            >
              <Image
                className={cn(
                  'absolute bottom-[-1px] right-[-6px] h-3 w-3',
                  isLastCol ? 'group-last:hidden' : '',
                )}
                src={'/ru/images/icons/triangle.svg'}
                alt=""
                width={10}
                height={10}
              />
            </div>
            <div
              className={cn(
                'border-Grey102 relative order-last w-1/2 rounded-e-md border-b border-e border-dashed',
                isLastCol ? 'w-full group-last:border-none' : 'w-1/2',
                arrowHeight[roundIndex],
              )}
            >
              <Image
                className={cn(
                  'absolute right-[-6px] top-[-1px] h-3 w-3 rotate-180',
                  isLastCol ? 'group-last:hidden' : '',
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
            'flex h-[72px] justify-between rounded-lg bg-card-background px-3 py-2',
            isLastCol
              ? 'group-first:rounded-e-none group-last:rounded-s-none'
              : '',
            className,
          )}
        >
          <div>
            <H4>{format(time, 'HH:mm')}</H4>
            <p className="text-ColorsGrey26 whitespace-pre-line text-sm">
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
      {!isLastCol && (
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
      <div className={cn(spaceHeight[roundIndex], 'group-last:h-0')}></div>
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
        <div className="bg-Grey100 relative flex cursor-pointer justify-center rounded-md p-[6px]">
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
      </HoverCardContent>
    </HoverCard>
  );
}

interface AthleteSmallCardProps {
  id: number;
  name: string;
  sirname: string;
  image_field: string;
  birthdate: string;
  team_name: string;
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
  const athleteAge = calculateAge(birthdate);
  return (
    <TextCard className="relative cursor-default flex-col gap-4 shadow-cardShadow transition-colors sm:flex-row lg:px-4 lg:py-3">
      <div className="flex w-full flex-row-reverse justify-between gap-4 sm:w-2/3 sm:flex-row sm:justify-start xl:items-center">
        <div className="relative h-14 w-14 sm:h-10 sm:w-10">
          <Avatar className="h-14 w-14 text-foreground sm:h-10 sm:w-10">
            <AvatarImage src={image_field} alt="" />
            <AvatarFallback className="text-base font-medium">
              {getInitials(name, sirname) || ''}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col">
          <H4 className="text-white">
            {id} {sirname} {name}
          </H4>
          <PersonDescriptionOnCard className="text-neutralForeground3">
            <b>{birthdate.split('-')[0]}</b> г.р.,{' '}
            <i>(возраст: {getRussianAgeWord(athleteAge)})</i>
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
