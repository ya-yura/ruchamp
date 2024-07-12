'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { updateScore } from "@/lib/data";


interface CounterProps {
  className?: string;
  fight_id: number;
}

function Counter({ className, fight_id }: CounterProps) {
  const [count, setCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function handleScoreChange(value) {
    try {
      const newCount = Math.max(count + value, 0);
      console.log(`Current count: ${count}, Change value: ${value}, New count: ${newCount}`);
      await updateScore(fight_id, newCount);
      setCount(newCount);
      setError(null);
    } catch (err) {
      console.error('Error updating score:', err);
      setError('Ошибка при изменении очков');
    }
  }

  return (
    <div className={cn('flex items-end', className)}>
      <div className="border-1 flex h-[24px] w-[56px] items-center justify-between rounded border border-neutralForeground3 bg-white px-1 py-1">
        <button
          onClick={() => handleScoreChange(-1)}
          className="flex h-[12px] w-[12px] items-center justify-between text-base text-neutralForeground3Rest"
        >
          -
        </button>
        <span className="text-xs text-neutralForeground3Rest">{count}</span>
        <button
          onClick={() => handleScoreChange(+1)}
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
