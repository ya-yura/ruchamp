import { useFormStatus } from 'react-dom';
import { Button } from '../ui/button';
import { Spinner } from '../spinner';
import { cn } from '@/lib/utils';

interface SubmitActionButtonProps {
  text: string;
  isValid: boolean;
  className?: string;
}

export function SubmitActionButton({
  text,
  isValid,
  className,
  ...props
}: SubmitActionButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      className={cn('flex w-full gap-3 px-9 sm:w-auto', className)}
      variant="ruchampDefault"
      type="submit"
      disabled={!isValid || pending}
      {...props}
    >
      {pending && <Spinner className="h-6 w-6" />} {text}
    </Button>
  );
}
