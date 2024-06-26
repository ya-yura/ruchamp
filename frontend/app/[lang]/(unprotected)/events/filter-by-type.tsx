'use client';

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { BadgeButton } from '@/components/badge-button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useWindowWidth } from '@/lib/hooks/useWindowWidth';
import { Badge } from '@/components/ui/badge';

interface FilterByTypeProps {
  options: string[];
  selected: string[];
  setSelected: Dispatch<SetStateAction<string[]>>;
  children?: React.ReactNode;
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
  children,
}: FilterByTypeProps) {
  const [poularSportsTypes, setPopularSportTypes] = useState<string[]>(options);
  const [unPoularSportsTypes, setUnPopularSportTypes] = useState<string[]>([]);
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
        {children}
      </div>
    </Popover>
  );
}
