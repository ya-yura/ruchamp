'use client';

import { Badge } from '@fluentui/react-components';
import React from 'react';
import {
  makeStyles,
  mergeClasses,
  tokens,
  shorthands,
} from '@fluentui/react-components';

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
      <Badge className={overrides.badge} size="extra-large" appearance="filled">
        Главное
      </Badge>
      <Badge className={overrides.badge} size="extra-large" appearance="filled">
        Айкидо
      </Badge>
      <Badge
        className={mergeClasses(overrides.badge, overrides.selected)}
        size="extra-large"
        appearance="filled"
      >
        Вольная борьба
      </Badge>
      <Badge className={overrides.badge} size="extra-large" appearance="filled">
        Греко-римская борьба
      </Badge>
      <Badge className={overrides.badge} size="extra-large" appearance="filled">
        Джиу-джитсу
      </Badge>
      <Badge className={overrides.badge} size="extra-large" appearance="filled">
        Дзюдо
      </Badge>
      <Badge className={overrides.badge} size="extra-large" appearance="filled">
        Карате
      </Badge>
      <Badge className={overrides.badge} size="extra-large" appearance="filled">
        Кикбоксинг
      </Badge>
      <Badge className={overrides.badge} size="extra-large" appearance="filled">
        Рукопашный бой
      </Badge>
      <Badge className={overrides.badge} size="extra-large" appearance="filled">
        Самбо
      </Badge>
      <Badge className={overrides.badge} size="extra-large" appearance="filled">
        Сумо
      </Badge>
      <Badge className={overrides.badge} size="extra-large" appearance="filled">
        Тхэквондо
      </Badge>
      <Badge className={overrides.badge} size="extra-large" appearance="filled">
        Ушу
      </Badge>
    </div>
  );
}
