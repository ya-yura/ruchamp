'use client';

import { TypeSportsTypes, sportsTypes } from '@/lib/constants';
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
  selectedSportTypes: TypeSportsTypes[];
  setSelected: Dispatch<SetStateAction<TypeSportsTypes[]>>;
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
  selectedSportTypes,
  setSelected,
}: FilterByTypeProps) {
  const [poularSportsTypes, setPopularSportTypes] = useState<TypeSportsTypes[]>(
    [],
  );
  const [unPoularSportsTypes, setUnPopularSportTypes] = useState<
    TypeSportsTypes[]
  >([]);
  const [windowWidth] = useWindowWidth();

  useEffect(() => {
    if (!windowWidth) return;
    if (windowWidth < limits.mobile.resolution) {
      setPopularSportTypes(sportsTypes.slice(0, limits.mobile.quantity));
      setUnPopularSportTypes(sportsTypes.slice(limits.mobile.quantity));
    } else if (
      limits.mobile.resolution <= windowWidth &&
      windowWidth < limits.tablet.resolution
    ) {
      setPopularSportTypes(sportsTypes.slice(0, limits.tablet.quantity));
      setUnPopularSportTypes(sportsTypes.slice(limits.tablet.quantity));
    } else {
      setPopularSportTypes(sportsTypes);
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
            selected={selectedSportTypes}
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
              selected={selectedSportTypes}
              setSelected={setSelected}
            />
          ))}
        </PopoverContent>
        <ModeSwither className="relative ml-auto lg:hidden" />
      </div>
    </Popover>
  );
}
