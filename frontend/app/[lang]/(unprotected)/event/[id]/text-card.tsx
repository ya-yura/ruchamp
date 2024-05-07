import { cn } from '@/lib/utils';

interface CustomCardProps {
  title?: string;
  text: string;
  className?: string;
}

export function TextCard({ title, text, className }: CustomCardProps) {
  return (
    <div
      className={cn(
        'bg-card-background flex flex-col items-start rounded-lg p-4 sm:p-5 lg:px-6 lg:py-8',
        className,
      )}
    >
      {title && (
        <h4 className="mb-3 text-xl sm:text-base md:text-xl font-semibold text-background">{title}</h4>
      )}
      <p className="text-text-mutedCard whitespace-pre-line text-sm">{text}</p>
    </div>
  );
}
