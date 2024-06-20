'use client';

import { cn } from '@/lib/utils';

type TypeCustomFormProps = {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  action?: string | ((formData: FormData) => void) | undefined;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLFormElement>;

export function CustomForm({
  className,
  onSubmit,
  action,
  children,
}: TypeCustomFormProps) {
  return (
    <form
      className={cn(
        'relative mx-auto flex h-fit w-3/4 flex-col justify-evenly gap-8 rounded-md bg-white px-7 py-8 sm:w-[464px] sm:py-7 sm:px-9 md:mx-0 md:my-auto',
        className,
      )}
      onSubmit={onSubmit}
      action={action}
    >
      {children}
    </form>
  );
}
