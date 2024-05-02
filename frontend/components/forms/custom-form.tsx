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
        'relative my-auto flex h-fit w-[464px] flex-col justify-evenly gap-8 rounded-md bg-white px-9 py-7',
        className,
      )}
      onSubmit={onSubmit}
      action={action}
    >
      {children}
    </form>
  );
}
