'use client';

import React from 'react';
import { SearchBox } from '@fluentui/react-search-preview';
import { makeStyles, tokens } from '@fluentui/react-components';

const useOverrides = makeStyles({
  searchBox: {
    backgroundColor: tokens.colorNeutralBackgroundInverted,
    width: '230px',
    '& input': {
      color: tokens.colorNeutralForegroundInverted,
    },
  },
});

export default function SearchBar() {
  const overrides = useOverrides();

  return (
    <div className="mx-auto">
      <SearchBox className={overrides.searchBox} placeholder="Найти" />
    </div>
  );
}
