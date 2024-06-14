import { ContentWraper } from '@/components/content-wraper';
import { Tag } from '@/components/tag';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { H4, H4low, PersonDescriptionOnCard } from '@/components/text';
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
    2: 'grid-cols-[repeat(2,_175px)]',
    3: 'grid-cols-[repeat(1,_175px)_130px_122px]',
    4: 'grid-cols-[repeat(2,_175px)_130px_122px]',
    5: 'grid-cols-[repeat(3,_175px)_130px_122px]',
    6: 'grid-cols-[repeat(4,_175px)_130px_122px]',
    7: 'grid-cols-[repeat(5,_175px)_130px_122px]',
  };
  const mtVariants: Record<string, string> = {
    0: 'mt-[0]',
    1: 'mt-[30px]',
    2: 'mt-[89px]',
    3: 'mt-[208px]',
    4: 'mt-[448px]',
    5: 'mt-[928px]',
    6: 'mt-[928px]',
  };

  return (
    <ScrollArea className="-mx-4 w-screen sm:mx-0 sm:w-full">
      <div className="flex w-[1300px] flex-col gap-5 xl:w-full">
        <ul className={cn('grid px-4', colVariants[rounds.length])}>
          {rounds.map((round, index) => (
            <li key={round.name}>
              {index === rounds.length - 1 || index === rounds.length - 2 ? (
                index === rounds.length - 1 ? (
                  <Image
                    className="mx-auto h-10 w-10"
                    src={'/ru/images/medals/gold.svg'}
                    alt=""
                    width={213}
                    height={241}
                  />
                ) : (
                  <Image
                    className="mx-auto h-10 w-10"
                    src={'/ru/images/medals/bronze.svg'}
                    alt=""
                    width={213}
                    height={241}
                  />
                )
              ) : (
                <p className="text-center text-4xl font-bold text-card-background pr-[53px]">
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
                  fight_id={fight.fight_info.fight_id}
                  time={fight.fight_info.start_time}
                  mat_number={fight.fight_info.mat_number}
                  player_1={fight.player_1}
                  player_2={fight.player_2}
                  isFirstCol={index === 0}
                  isLastCol={index === rounds.length - 1}
                  isPreLastCol={index === rounds.length - 2}
                  isPreSemiFinalCol={index === rounds.length - 3}
                  roundsNumber = {rounds.length}
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
  fight_id: number;
  time: string;
  mat_number: number;
  player_1: GridPlayer;
  player_2: GridPlayer;
  isFirstCol?: boolean;
  isLastCol?: boolean;
  isPreLastCol?: boolean;
  isPreSemiFinalCol?: boolean;
  roundIndex: number;
  roundsNumber: number;
  className?: string;
}

export function GridCard({
  fight_id,
  time,
  mat_number,
  player_1,
  player_2,
  isFirstCol,
  isLastCol,
  isPreLastCol,
  isPreSemiFinalCol,
  roundIndex,
  roundsNumber,
  className,
}: GridCardProps) {
  const isPlayerFirstWinner = player_1.points > player_2.points;
  const isDraw = player_1.points === player_2.points;
  const arrowHeight: Record<string, string> = {
    0: 'h-[13px]',
    1: 'h-[44px]',
    2: 'h-[104px]',
    3: 'h-[224px]',
    4: 'h-[464px]',
    5: 'h-[828px]',
  };
  const arrowTop: Record<string, string> = {
    0: 'top-[12.5px]',
    1: 'top-[43px]',
    2: 'top-[103px]',
    3: 'top-[223px]',
    4: 'top-[463px]',
    5: 'top-[828px]',
  };
  const arrowTopShift: Record<string, string> = {
    0: 'h-[29%]',
    1: 'h-[29%]',
    2: 'h-[15%]',
    3: 'h-[7%]',
    4: 'h-[3.5%]',
  };
  const arrowBottomShift: Record<string, string> = {
    0: 'h-[71%]',
    1: 'h-[71%]',
    2: 'h-[39%]',
    3: 'h-[18%]',
    4: 'h-[9%]',
  };
  // Вывод стрелок на бронзовый матч для соревнований,начинающихся с 1/4-1/32
  const bronzeArrowHeight: Record<string, string> = {
    4: 'h-[19px]',
    5: 'h-[79px]',
    6: 'h-[199px]',
    7: 'h-[439px]',
  };
  const bronzeArrowTop: Record<string, string> = {
    4: 'top-[18px]',
    5: 'top-[78px]',
    6: 'top-[198px]',
    7: 'top-[438px]',
  };
  const bronzeArrowTopShift: Record<string, string> = {
    4: 'top-[-34px]',
    5: 'top-[-84px]',
    6: 'top-[-201px]',
    7: 'top-[-441px]',
  };
  const bronzeArrowBottomShift: Record<string, string> = {
    4: 'top-[-53px]',
    5: 'top-[-119px]',
    6: 'top-[-243px]',
    7: 'top-[-487px]',
  };
  //
  const spaceHeight: Record<string, string> = {
    0: 'h-[4px]',
    1: 'h-[64px]',
    2: 'h-[136px]',
    3: 'h-[256px]',
    4: 'h-[495px]',
    5: 'h-[0]',
    6: 'h-[0]',
  };

  return (
    <li className={cn('group grid cursor-default',
      isPreSemiFinalCol ? 'grid-cols-[122px_381px]':
      (!isLastCol && !isPreLastCol) ? 'grid-cols-[122px_153px]' : '',
    )}>
      <div className={cn('flex flex-col', isPreLastCol ? 'mr-2' : '')}>
        <div
          className={cn(
            'relative flex h-[56px] justify-between rounded-lg bg-card-background px-2 py-1.5',
            className,
          )}
        >
          <div>
            <H4low className="text-white text-nowrap">{format(time, 'HH:mm')}</H4low>
            <p className="text-ColorsGrey26 text-nowrap text-sm">
              Мат № {mat_number}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <GridCardPlayerId
              player={player_1}
              isWinner={isPlayerFirstWinner && !isDraw}
              isPreLastCol={isPreLastCol}
              isLastCol={isLastCol}
            />
            <GridCardPlayerId
              player={player_2}
              isWinner={!isPlayerFirstWinner && !isDraw}
              isPreLastCol={isPreLastCol}
              isLastCol={isLastCol}
            />
          </div>
          {(isLastCol || isPreLastCol) && (
            <div className='text-[11px] font-black text-Grey90 flex flex-col justify-between items-center py-0.5'>
              <p>{player_1.points}</p>  
              <p>{player_2.points}</p>  
            </div>
          )}
        </div>
      </div>
      {!(isLastCol || isPreLastCol) && (
        <>
          <div className={cn('relative flex w-full items-end',
            fight_id % 2 === 0 ? arrowBottomShift[roundIndex] : arrowTopShift[roundIndex])}>
            <div className="border-Grey102 w-[53px] border-b border-dashed h-full"></div>
            <p className={cn('relative text-nowrap px-[5.5px] text-xs font-semibold text-text-muted',
              fight_id % 2 === 0 ? 'bottom-[-8px]' : 'top-[7px]'
            )}>
              <span
                className={cn(isPlayerFirstWinner && !isDraw ? 'text-white' : '')}
              >
                {player_1.points}
              </span>{' '}
              :{' '}
              <span
                className={cn(
                  !isPlayerFirstWinner && !isDraw ? 'text-white' : ''
                )}
              >
                {player_2.points}
              </span>
            </p>
            <div
              className={cn(
                'border-Grey102 relative w-1/2 border-e border-dashed',
                fight_id % 2 === 0 ? 'rounded-br-md border-b' : `rounded-tr-md border-t ${arrowTop[roundIndex]}`,
                isLastCol
                  ? 'relative bottom-0 right-[90%] w-[calc(100%+40%)]'
                  : '',
                isLastCol
                  ? arrowHeight[roundIndex - 1]
                  : arrowHeight[roundIndex]
              )}
            >
              <Image
                className={cn(
                  'absolute right-[-4px]  h-[7px] w-[7px]',
                  fight_id % 2 === 0 ? 'rotate-180 top-[-1px]' : 'bottom-[-1px]'
                )}
                src={'/ru/images/icons/triangle.svg'}
                alt=""
                width={10}
                height={10} />
            </div>
          </div>
          <div
            className={cn(
              'group-last:h-0',
              isLastCol ? spaceHeight[roundIndex - 1] : spaceHeight[roundIndex]
            )}
          ></div>
          {isPreSemiFinalCol && (
            <div className={cn('relative flex w-[151px] items-end',
              fight_id % 2 === 0 ? `${bronzeArrowBottomShift[roundsNumber]} ${arrowBottomShift[roundIndex]}` : `${bronzeArrowTopShift[roundsNumber]} ${arrowTopShift[roundIndex]}`)}>
              <div className="border-Grey102 w-[53px] border-b border-dashed h-full"></div>
              <p className={cn('relative text-nowrap px-[5.5px] text-xs font-semibold text-text-muted',
                fight_id % 2 === 0 ? 'bottom-[-8px]' : 'top-[7px]'
              )}>
                <span
                  className={cn(isPlayerFirstWinner && !isDraw ? 'text-white' : '')}
                >
                  {player_1.points}
                </span>{' '}
                :{' '}
                <span
                  className={cn(
                    !isPlayerFirstWinner && !isDraw ? 'text-white' : ''
                  )}
                >
                  {player_2.points}
                </span>
              </p>
              <div
                className={cn(
                  'border-Grey102 relative w-[60px] border-e border-dashed',
                  fight_id % 2 === 0 ? 'rounded-br-md border-b' : `rounded-tr-md border-t ${bronzeArrowTop[roundsNumber]}`,
                  bronzeArrowHeight[roundsNumber]
                )}
              >
                <Image
                  className={cn(
                    'absolute right-[-4px]  h-[7px] w-[7px]',
                    fight_id % 2 === 0 ? 'rotate-180 top-[-1px]' : 'bottom-[-1px]'
                  )}
                  src={'/ru/images/icons/triangle.svg'}
                  alt=""
                  width={10}
                  height={10} />
              </div>
            </div>
          )}
        </>
      )}
    </li>
  );
}

function GridCardPlayerId({
  player,
  isWinner,
  isLastCol,
  isPreLastCol,
}: {
  player: GridPlayer;
  isWinner: boolean;
  isLastCol: boolean | undefined;
  isPreLastCol: boolean | undefined;
}) {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <div
          className={cn(
            'bg-Grey100 relative flex justify-center items-center rounded-md p-[6px] w-[29px] h-5',
            player.first_name ? 'cursor-pointer' : '',
            isWinner && (isPreLastCol ? 'bg-bronze': 
            isLastCol ? 'bg-gold' : '' ),
            !isWinner && isLastCol ? 'bg-silver' : ''
          )}
        >
          {isWinner && !isLastCol && !isPreLastCol && (
            <Image
              className="absolute left-0 top-[calc(50%-5px)]"
              src={'/ru/images/icons/winner-marker.svg'}
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
