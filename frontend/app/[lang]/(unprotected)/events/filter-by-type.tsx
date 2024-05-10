'use client';

import { SportsTypes } from '@/lib/constants';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { BadgeButton } from '@/components/badge-button';
import { ModeSwither } from './events-tabs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useWindowWidth } from '@/lib/hooks/useWindowWidth';
import { Badge } from '@/components/ui/badge';

interface FilterByTypeProps {
  options: SportsTypes[];
  selected: SportsTypes[];
  setSelected: Dispatch<SetStateAction<SportsTypes[]>>;
  isOnMode?: boolean;
  setIsOnMode?: Dispatch<SetStateAction<boolean>>;
}

type Limit = {
  resolution: number;
  quantity: number;
};

type Limits = {
  mobile: Limit;
  tablet: Limit;
};

const limits: Limits = {
  mobile: {
    resolution: 640,
    quantity: 7,
  },
  tablet: {
    resolution: 1024,
    quantity: 14,
  },
};

export function FilterByType({
  options,
  selected,
  setSelected,
  isOnMode,
  setIsOnMode,
}: FilterByTypeProps) {
  const [poularSportsTypes, setPopularSportTypes] = useState<SportsTypes[]>([]);
  const [unPoularSportsTypes, setUnPopularSportTypes] = useState<SportsTypes[]>(
    [],
  );
  const [windowWidth] = useWindowWidth(500);

  useEffect(() => {
    if (!windowWidth) return;
    if (windowWidth < limits.mobile.resolution) {
      setPopularSportTypes(options.slice(0, limits.mobile.quantity));
      setUnPopularSportTypes(options.slice(limits.mobile.quantity));
    } else if (
      limits.mobile.resolution <= windowWidth &&
      windowWidth < limits.tablet.resolution
    ) {
      setPopularSportTypes(options.slice(0, limits.tablet.quantity));
      setUnPopularSportTypes(options.slice(limits.tablet.quantity));
    } else {
      setPopularSportTypes(options);
      setUnPopularSportTypes([]);
    }
  }, [windowWidth]);

  return (
    <Popover>
      <div className="mb-8 flex max-w-5xl flex-wrap gap-1 self-start">
        {poularSportsTypes.map((type) => (
          <BadgeButton
            key={type}
            title={type}
            selected={selected}
            setSelected={setSelected}
          />
        ))}
        <PopoverTrigger className="lg:hidden" asChild>
          <Button
            variant="outline"
            className="w-fit border-none bg-transparent p-0 hover:border-none hover:bg-transparent"
            aria-label="..."
          >
            <Badge variant={'ruchampDefault'}>...</Badge>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex min-w-72 flex-wrap gap-x-2">
          {unPoularSportsTypes.map((type) => (
            <BadgeButton
              key={type}
              title={type}
              selected={selected}
              setSelected={setSelected}
            />
          ))}
        </PopoverContent>
        {isOnMode && setIsOnMode && (
          <ModeSwither
            isOnMode={isOnMode}
            setIsOnMode={setIsOnMode}
            className="relative ml-auto lg:hidden"
          />
        )}
      </div>
    </Popover>
  );
}
