'use client';

import { Badge } from '@fluentui/react-components';
import React from 'react';
import {
  makeStyles,
  mergeClasses,
  tokens,
  shorthands,
} from '@fluentui/react-components';
import { sportsTypes } from '@/lib/constants';

const useOverrides = makeStyles({
  badge: {
    backgroundColor: tokens.colorNeutralForegroundInverted,
    fontSize: '16px',
    letterSpacing: '-0.5px',
    ...shorthands.padding('6px', '16px'),
  },
  selected: {
    backgroundColor: tokens.colorNeutralForeground2,
    color: tokens.colorNeutralStrokeDisabled,
  },
});

export function Badges() {
  const overrides = useOverrides();

  return (
    <div className="flex max-w-5xl flex-wrap gap-3 self-start">
      {sportsTypes.map((type) => (
        <Badge
          key={type}
          className={
            type === 'Вольная борьба'
              ? mergeClasses(overrides.badge, overrides.selected)
              : overrides.badge
          }
          size="extra-large"
          appearance="filled"
        >
          {type}
        </Badge>
      ))}
    </div>
  );
}
