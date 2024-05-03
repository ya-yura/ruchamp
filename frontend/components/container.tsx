import { cn } from '@/lib/utils';

type TypeContainerProps = {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export function Container({ children, className }: TypeContainerProps) {
  return (
    <main
      className={cn(
        'flex min-h-[calc(100vh-137px)] flex-col items-center justify-start bg-primary-background pt-3',
        className,
      )}
    >
      {children}
    </main>
  );
}
