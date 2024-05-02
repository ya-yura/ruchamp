import * as React from 'react';

import { cn } from '@/lib/utils';
import { Button } from './button';
import { EyeIcon } from '@heroicons/react/24/outline';
import { EyeSlashIcon } from '@heroicons/react/24/outline';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [isPasswordShown, setIsPasswordShown] =
      React.useState<boolean>(false);
    return (
      <>
        <input
          type={isPasswordShown ? 'text' : type}
          className={cn(
            'focus-visible:shadow-inputFocused flex h-10 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm shadow-input ring-offset-background transition-shadow file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          ref={ref}
          {...props}
        />
        {type === 'password' && (
          <EyeButton
            isShown={isPasswordShown}
            setIsShown={setIsPasswordShown}
          />
        )}
      </>
    );
  },
);
Input.displayName = 'Input';

export function EyeButton({
  isShown,
  setIsShown,
}: {
  isShown: boolean;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <>
      <Button
        className="absolute right-2 top-6 h-fit border-none p-0 text-[#616161] hover:bg-transparent hover:text-[#616161] hover:opacity-80"
        type="button"
        variant="ruchampTransparent"
        onClick={() => setIsShown(!isShown)}
      >
        {isShown ? (
          <EyeSlashIcon className="h-6 w-6" />
        ) : (
          <EyeIcon className="h-6 w-6" />
        )}
      </Button>
    </>
  );
}

export { Input };
