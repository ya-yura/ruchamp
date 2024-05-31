import { cn } from '@/lib/utils';

export interface TextCardColoredProps {
  title?: string;
  text?: string;
  className?: string;
  children?: React.ReactNode;
  titleStyles?: string;
  textStyles?: string;
}

export function TextCardColored({
  title,
  text,
  className,
  titleStyles,
  textStyles,
  children,
}: TextCardColoredProps) {
  return (
    <li
      className={cn(
        'flex flex-col items-start rounded-lg bg-card-background p-5',
        className,
      )}
    >
      {title && <h4 className={cn('mb-3 text-lg', titleStyles)}>{title}</h4>}
      {text && (
        <p
          className={cn(
            'whitespace-pre-line text-sm text-text-mutedCard',
            textStyles,
          )}
        >
          {text}
        </p>
      )}
      {children}
    </li>
  );
}
