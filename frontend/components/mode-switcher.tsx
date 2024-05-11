import { Dispatch, SetStateAction } from 'react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';

interface ModeSwitherProps {
  isOnMode: boolean;
  setIsOnMode: Dispatch<SetStateAction<boolean>>;
  label: string;
  id: string;
  className?: string;
}

export function ModeSwither({
  isOnMode,
  setIsOnMode,
  label,
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
        checked={isOnMode}
        onCheckedChange={() => setIsOnMode(!isOnMode)}
        id={id}
      />
      <Label className="text-sm font-normal text-background" htmlFor={id}>
        {label}
      </Label>
    </div>
  );
}
