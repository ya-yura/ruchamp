'use client';

import { BadgeButton } from '@/components/badge-button';
import { cn } from '@/lib/utils';

interface TypeBadgesProps extends React.HTMLAttributes<HTMLDivElement> {
  types: string[];
}

export function Badges({ types, className }: TypeBadgesProps) {
  return (
    <div
      className={cn(
        'mb-8 flex max-w-5xl flex-wrap gap-1 self-start',
        className,
      )}
    >
      {types.map((type) => (
        <BadgeButton key={type} title={type} isDisabled={true} />
      ))}
    </div>
  );
}
