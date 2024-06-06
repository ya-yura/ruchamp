import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import React, { Dispatch, SetStateAction } from 'react';

interface RangeSliderProps {
  title: string;
  defaultValue: number[];
  minValue?: number;
  maxValue?: number;
  step?: number;
  minStepsBetweenThumbs?: number;
  value: number[];
  setValue: Dispatch<SetStateAction<number[]>>;
  className?: string;
}

export function RangeSlider({
  title,
  defaultValue,
  minValue = 0,
  maxValue = 100,
  step = 1,
  minStepsBetweenThumbs = 5,
  value,
  setValue,
  className,
}: RangeSliderProps) {
  const range = value.length ? value : defaultValue;

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div className="flex gap-2 text-sm text-text-mutedLight">
        <p>{title}</p>
        <p>от:</p>
        <b className="text-background">{range[0]}</b>
        <p>до: </p>
        <b className="text-background">{range[1]}</b>
      </div>
      <Slider
        defaultValue={defaultValue}
        min={minValue}
        max={maxValue}
        step={step}
        minStepsBetweenThumbs={minStepsBetweenThumbs}
        onValueChange={(data) => setValue(data)}
      />
    </div>
  );
}
