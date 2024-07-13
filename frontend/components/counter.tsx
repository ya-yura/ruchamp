'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { updateScore } from "@/lib/data";

interface CounterProps {
  className?: string;
  fight_id: number;
  id: number;
  opponent_id: number;
  is_current_player_first: boolean;
  onPlayerScoreChange: (newScore: number) => void;
}

function Counter({ className, fight_id,id, opponent_id, is_current_player_first, onPlayerScoreChange }: CounterProps) {
  const firstPlayerId = is_current_player_first ? id : opponent_id;
  const secondPlayerId = is_current_player_first ? opponent_id : id;
  const [count, setCount] = useState<number>(0);

  async function handleScoreChange(value: number) {
    try {
      const firstPlayerScore = is_current_player_first ? value :0;
      const secondPlayerScore = is_current_player_first ? 0 : value;
      console.log(firstPlayerScore)
      console.log(secondPlayerScore)

      await updateScore(fight_id, firstPlayerId, secondPlayerId, firstPlayerScore, secondPlayerScore);
      setCount(c => c + value);
      onPlayerScoreChange(value);
    } catch (err) {
      throw new Error('Ошибка при изменении очков')
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
