import { Dispatch, SetStateAction } from 'react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';

interface ModeSwitherProps {
  isOnMode: boolean;
  setIsOnMode: Dispatch<SetStateAction<boolean>>;
  label: string;
  alternativeLabel?: string;
  id: string;
  className?: string;
}

export function ModeSwither({
  isOnMode,
  setIsOnMode,
  label,
  alternativeLabel,
  id,
  className,
}: ModeSwitherProps) {
  return (
    <div
      className={cn(
        `absolute right-0 flex items-center space-x-2 py-2`,
        className,
      )}
    >
      <Switch
        className="order-2"
        checked={isOnMode}
        onCheckedChange={() => setIsOnMode(!isOnMode)}
        id={id}
      />
      <Label
        className="order-3 text-sm font-normal text-background peer-data-[state=checked]:font-bold peer-data-[state=unchecked]:text-neutralForeground3Rest"
        htmlFor={id}
      >
        {label}
      </Label>
      {alternativeLabel && (
        <Label
          className="order-1 pr-2 text-sm font-normal text-background peer-data-[state=unchecked]:font-bold peer-data-[state=checked]:text-neutralForeground3Rest"
          htmlFor={id}
        >
          {alternativeLabel}
        </Label>
      )}
    </div>
  );
}
