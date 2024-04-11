import { cn } from '@/lib/utils';

type TypeCustomFormProps = {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLFormElement>;

export function CustomForm({
  className,
  onSubmit,
  children,
}: TypeCustomFormProps) {
  return (
    <form
      className={cn(
        'relative my-auto flex h-fit w-auto flex-col justify-evenly rounded-md bg-white px-9 py-7',
        className,
      )}
      onSubmit={onSubmit}
    >
      {children}
    </form>
  );
}
