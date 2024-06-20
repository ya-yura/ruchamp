import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const tagVariants = cva(
  'flex items-center justify-center text-center w-fit rounded-md border text-xs font-semibold',
  {
    variants: {
      variant: {
        default:
          'bg-NeutralBackground4Rest border-NeutralStroke2Rest  text-neutralForeground3Rest',
        transparentGrayBorder:
          'bg-transparent border-neutralForeground3Rest text-neutralForeground3Rest',
        transparentAccentBorder:
          'bg-transparent border-primary-mainAccent text-primary-mainAccent',
        transparentWhiteBorder: 'bg-transparent border-white text-white',
        whiteGreyvBorder: 'bg-white border-NeutralStroke2Rest text-neutralForeground3Rest',
      },

      size: {
        default: 'px-2 py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface TagProps
  extends React.ButtonHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tagVariants> {
  children?: React.ReactNode;
}

const Tag = React.forwardRef<HTMLDivElement, TagProps>(
  ({ className, variant, size, children }, ref) => {
    return (
      <p className={cn(tagVariants({ variant, size, className }))} ref={ref}>
        {children}
      </p>
    );
  },
);
Tag.displayName = 'Tag';

export { Tag, tagVariants };
