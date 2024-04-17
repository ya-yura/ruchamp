'use client';

import { TypeSportsTypes, sportsTypes } from '@/lib/constants';
import React, { Dispatch, SetStateAction } from 'react';
import { BadgeButton } from '@/components/badge-button';

interface FilterByTypeProps {
  setSelected: Dispatch<SetStateAction<TypeSportsTypes[]>>;
}

export function FilterByType({ setSelected }: FilterByTypeProps) {
  return (
    <div className="mb-8 flex max-w-5xl flex-wrap gap-1 self-start">
      {sportsTypes.map((type) => (
        <BadgeButton key={type} type={type} setSelected={setSelected} />
      ))}
    </div>
  );
}
