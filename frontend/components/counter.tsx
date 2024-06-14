'use client';

import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  function handleClick(value: number) {
    if (value > 0) {
      setCount(count + value);
    } else if (count > 0 && value < 0) {
      // если значение меньше нуля и счётчик больше нуля
      setCount(count - Math.abs(value));
    }
  }

  return (
    <>
      <div className="border-1 flex h-[24px] w-[56px] items-center justify-between rounded border border-neutralForeground3 bg-white px-1 py-1">
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
    </>
  );
}

export default Counter;
