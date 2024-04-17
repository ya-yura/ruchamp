'use client';

import { TypeSportsTypes } from '@/lib/constants';
import { BadgeButton } from '@/components/badge-button';
import { cn } from '@/lib/utils';

type TypeBadgesProps = {
  types: TypeSportsTypes[];
} & React.HTMLAttributes<HTMLDivElement>;

export function Badges({ types, className }: TypeBadgesProps) {
  return (
    <div
      className={cn(
        'mb-8 flex max-w-5xl flex-wrap gap-1 self-start',
        className,
      )}
    >
      {types.map((type) => (
        <BadgeButton key={type} type={type} isDisabled={true} />
      ))}
    </div>
  );
}