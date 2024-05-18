import { cn } from '@/lib/utils';
import React from 'react';

interface CustomSectionProps {
  children: React.ReactNode;
  className?: string;
}

const CustomSection = React.forwardRef<HTMLDivElement, CustomSectionProps>(
  ({ className, ...props }, ref) => {
    return (
      <section
        className={cn(
          `flex w-full flex-col bg-primary-background`,
          `items-center justify-between`,
          `px-4`,
          `sm:px-7`,
          `md:px-10`,
          `lg:px-[72px]`,
          className,
        )}
        ref={ref}
        {...props}
      ></section>
    );
  },
);

export { CustomSection };
