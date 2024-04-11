import { cn } from '@/lib/utils';

type TypeContentWraper = {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export function ContentWraper({ className, children }: TypeContentWraper) {
  return (
    <div className={cn(`mx-auto flex w-full max-w-7xl flex-col`, className)}>
      {children}
    </div>
  );
}
