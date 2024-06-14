'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface StyleProps {
  className?: string;
}

function Counter({ className }: StyleProps) {
  const [count, setCount] = useState(0);

  function handleClick(value: 1 | -1) {
    setCount((count) => Math.max(count + value, 0));
  }

  return (
    <div className="flex items-end">
      <div
        className={cn(
          'border-1 flex h-[24px] w-[56px] items-center justify-between rounded border border-neutralForeground3 bg-white px-1 py-1',
          className,
        )}
      >
        <button
          onClick={() => handleClick(-1)}
          className="flex h-[12px] w-[12px] items-center justify-between text-base text-neutralForeground3Rest"
        >
          -
        </button>
        <span className="text-xs text-neutralForeground3Rest">{count}</span>
        <button
          onClick={() => handleClick(1)}
          className="flex h-3 w-3 items-center justify-between text-base text-neutralForeground3Rest"
        >
          +
        </button>
      </div>
      <p className="ml-1.5">баллов</p>
    </div>
  );
}

export default Counter;
