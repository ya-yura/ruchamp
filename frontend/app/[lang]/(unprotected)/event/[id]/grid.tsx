import { ContentWraper } from '@/components/content-wraper';
import { GridFight, GridInfo, GridPlayer, GridRound } from './page';
import { Tag } from '@/components/tag';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { H4 } from '@/components/text';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';

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
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
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
          <ul key={round.name} className={cn(mtVariants[index])}>
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

        {/* <GridCol fights={rounds[0].fights} isFirstCol={true} />
        {rounds.slice(1).map((round) => (
          <GridCol key={round.name} fights={round.fights} />
        ))} */}
      </ul>
    </div>
  );
}

// interface GridColProps {
//   fights: GridFight[];
//   isFirstCol?: boolean;
//   isLastCol?: boolean;
// }

// function GridCol({ fights, isFirstCol, isLastCol }: GridColProps) {
//   return (
//     <ul className={cn(isFirstCol ? 'mt-0' : 'mt-[36px]')}>
//       {fights.map((fight) => (
//         <GridCard
//           key={fight.fight_info.fight_id}
//           time={fight.fight_info.start_time}
//           mat_number={fight.fight_info.mat_number}
//           player_1={fight.player_1}
//           player_2={fight.player_2}
//           isFirstCol={isFirstCol}
//           isLastCol={isLastCol}
//         />
//       ))}
//     </ul>
//   );
// }

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
    <li className="grid grid-cols-[122px_1fr]">
      <div className="flex flex-col">
        {!isFirstCol && (
          <>
            <div
              className={cn(
                'border-Grey102 relative order-first w-1/2 border-e border-t border-dashed',
                arrowHeight[roundIndex],
              )}
            >
              <Image
                className="absolute bottom-[-1px] right-[-6px] h-3 w-3"
                src={'/ru/images/icons/triangle.svg'}
                alt=""
                width={10}
                height={10}
              />
            </div>
            <div
              className={cn(
                'border-Grey102 relative order-last w-1/2 border-b border-e border-dashed',
                arrowHeight[roundIndex],
              )}
            >
              <Image
                className="absolute right-[-6px] top-[-1px] h-3 w-3 rotate-180"
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
            <GridCardPlayerId player={player_1} isWinner={true} />
            <GridCardPlayerId player={player_2} isWinner={true} />
          </div>
        </div>
      </div>
      {!isLastCol && (
        <div className="relative flex h-1/2 w-full items-end">
          <div className="border-Grey102 w-full border-b border-dashed"></div>
          <p className="relative bottom-[-8px] mt-[10px] text-nowrap px-1 text-xs font-semibold text-text-muted">
            <span className={cn(isPlayerFirstWinner ? 'text-white' : '')}>
              {player_1.points}
            </span>{' '}
            :{' '}
            <span className={cn(!isPlayerFirstWinner ? 'text-white' : '')}>
              {player_2.points}
            </span>
          </p>
        </div>
      )}

      <div className={cn(spaceHeight[roundIndex])}></div>
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
    <div className="bg-Grey100 relative flex justify-center rounded-md p-[6px]">
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
  );
}
