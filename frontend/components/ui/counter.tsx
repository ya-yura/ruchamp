'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  function handlePlusClick() {
    setCount(count + 1);
  }

  function handleMinusClick() {
    if (count > 0) {
      setCount(count - 1);
    }
  }

  return (
    <>
      <div className="border-1 flex h-[24px] w-[56px] items-center justify-between rounded border border-[#D1D1D1] bg-white px-1 py-1">
        <button
          onClick={handleMinusClick}
          className="flex h-[12px] w-[12px] items-center justify-between text-base text-[#707070]"
        >
          -
        </button>
        <span className="text-xs text-[#707070]">{count}</span>
        <button
          onClick={handlePlusClick}
          className="flex h-3 w-3 items-center justify-between text-base text-[#707070]"
        >
          +
        </button>
      </div>
    </>
  );
}
