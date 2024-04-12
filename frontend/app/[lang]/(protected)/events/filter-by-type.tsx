'use client';

import { TypeSportsTypes, sportsTypes } from '@/lib/constants';
import React, { useState } from 'react';
import { BadgeButton } from './badge-button';

export function FilterByType() {
  const [selectedSportTypes, setSelectedSportTypes] = useState<
    Array<TypeSportsTypes>
  >([]);

  console.log(selectedSportTypes);
  return (
    <div className="flex max-w-5xl flex-wrap gap-1 self-start">
      {sportsTypes.map((type) => (
        <BadgeButton
          key={type}
          type={type}
          setSelected={setSelectedSportTypes}
        />
      ))}
    </div>
  );
}
