'use client';

import { TypeSportsTypes, sportsTypes } from '@/lib/constants';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { BadgeButton } from './badge-button';

type TypeFilterByTypeProps = {
  setSelected: Dispatch<SetStateAction<Array<TypeSportsTypes>>>;
};

export function FilterByType({ setSelected }: TypeFilterByTypeProps) {
  return (
    <div className="flex max-w-5xl flex-wrap gap-1 self-start">
      {sportsTypes.map((type) => (
        <BadgeButton key={type} type={type} setSelected={setSelected} />
      ))}
    </div>
  );
}
