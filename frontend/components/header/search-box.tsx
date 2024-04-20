'use client';

import * as React from 'react';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

export function SearchBar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('relative flex', className)}>
      <Search
        className="absolute left-2 top-2.5 mr-2 h-4 w-4"
        stroke="lightgray"
      />
      <Input className="h-9 pl-7 text-black" placeholder="Найти" />
    </div>
  );
}
