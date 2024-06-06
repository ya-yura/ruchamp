import { H4 } from '@/components/text';
import { cn } from '@/lib/utils';

export interface TextCardProps {
  title?: string;
  text?: string;
  className?: string;
  children?: React.ReactNode;
}

export function TextCard({ title, text, className, children }: TextCardProps) {
  return (
    <li
      className={cn(
        'flex flex-col items-start rounded-lg bg-card-background p-4 sm:p-5 lg:px-6 lg:py-8',
        className,
      )}
    >
      {title && <H4 className={cn('mb-3')}>{title}</H4>}
      {text && (
        <p className={cn('whitespace-pre-line text-sm text-text-mutedCard')}>
          {text}
        </p>
      )}
      {children}
    </li>
  );
}
