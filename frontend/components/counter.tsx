'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
interface CounterProps {
  className?: string;
  fight_id: [];
}

function Counter({ className, fight_id }: CounterProps) {
  const [count, setCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function mockApiCall(url: string, options: any) {
    return new Promise((resolve, reject) => {
      console.log(`Mock API Call to URL: ${url}`);
      console.log('Options:', options);

      setTimeout(() => {
        if (url.includes('matches')) {
          resolve({ ok: true });
        } else {
          reject(new Error('Ошибка при изменении очков'));
        }
      }, 500);
    });
  }

  async function handleScoreChange(value: 1 | -1) {
    try {
      const newCount = Math.max(count + value, 0);
      const response: any = await mockApiCall(`https://sportplatform.ru/api/matches/${fight_id}/score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ score: newCount }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при изменении очков');
      }
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
