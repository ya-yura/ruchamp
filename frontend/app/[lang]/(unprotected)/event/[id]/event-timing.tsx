import { cn } from '@/lib/utils';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { ValueOption } from '../../team/[id]/page';
import { determineDateStatus } from '@/lib/utils/date-and-time';
import { H4 } from '@/components/text';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface EventTimingProps {
  regStart: ValueOption;
  regEnd: ValueOption;
  matchesStart: ValueOption;
  matchesEnd: ValueOption;
  awardingTime: ValueOption;
}

export function EventTiming({
  regStart,
  regEnd,
  matchesStart,
  matchesEnd,
  awardingTime,
}: EventTimingProps) {
  return (
    <ScrollArea className="-mx-4 w-screen sm:mx-0 sm:w-full">
      <div className="flex w-[800px] flex-col gap-4 rounded-lg bg-black px-10 py-7 sm:w-auto">
        <div className="grid grid-cols-[36px_1fr_36px_1fr_36px_1fr_36px_1fr_36px] items-center px-[50px] sm:px-[30px] md:px-[50px] lg:px-[65px] xl:px-[90px]">
          <TimeSpot date={regStart.value as string} />
          <TimeLine date={regEnd.value as string} />
          <TimeSpot date={regEnd.value as string} />
          <TimeLine date={matchesStart.value as string} />
          <TimeSpot date={matchesStart.value as string} />
          <TimeLine date={matchesEnd.value as string} />
          <TimeSpot date={matchesEnd.value as string} />
          <TimeLine date={awardingTime.value as string} />
          <TimeSpot date={awardingTime.value as string} />
        </div>
        <ul className="grid grid-cols-5 gap-5">
          <li className="flex flex-col justify-between">
            <H4 className="text-center">Начало регистрации</H4>
            <p className="text-center text-base text-neutralForeground3Rest md:text-xl">
              {regStart.displayedValue}
            </p>
          </li>
          <li className="flex flex-col justify-between">
            <H4 className="text-center">Завершение регистрации</H4>
            <p className="text-center text-base text-neutralForeground3Rest md:text-xl">
              {regEnd.displayedValue}
            </p>
          </li>
          <li className="flex flex-col justify-between">
            <H4 className="text-center">Начало боёв</H4>
            <p className="text-center text-base text-neutralForeground3Rest md:text-xl">
              {matchesStart.displayedValue}
            </p>
          </li>
          <li className="flex flex-col justify-between">
            <H4 className="text-center">Завершение боёв</H4>
            <p className="text-center text-base text-neutralForeground3Rest md:text-xl">
              {matchesEnd.displayedValue}
            </p>
          </li>
          <li className="flex flex-col justify-between">
            <H4 className="text-center">Награждение победителей</H4>
            <p className="text-center text-base text-neutralForeground3Rest md:text-xl">
              {awardingTime.displayedValue}
            </p>
          </li>
        </ul>
      </div>
      <ScrollBar className="hidden" orientation="horizontal" />
    </ScrollArea>
  );
}

function TimeSpot({ date }: { date: string }) {
  const [state, setState] = useState<'past' | 'present' | 'future'>('future');
  useEffect(() => {
    setState(determineDateStatus(date));
  }, [date]);

  return (
    <Image
      src={`/images/icons/checkbox-${state}.svg`}
      alt=""
      width={36}
      height={36}
    />
  );
}

function TimeLine({ date }: { date: string }) {
  const [state, setState] = useState<'past' | 'present' | 'future'>('future');
  useEffect(() => {
    setState(determineDateStatus(date));
  }, [date]);

  return (
    <div
      className={cn(
        'h-1 w-full',
        state !== 'future' ? ' bg-primary-mainAccent' : ' bg-NeutralGrayColor1',
      )}
    ></div>
  );
}
