// interface MarkerProps {
//   children: string;
// }

// export function Marker({ children }: MarkerProps) {
//   return (
//     <div>
//       <p className="rounded border border-solid border-SuccessGreenStroke bg-SuccessGreenBg p-1 text-[10px] text-SuccessGreenText">
//         {children}
//       </p>
//     </div>
//   );
// }

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const markerVariants = cva('rounded border border-solid p-1 text-[10px] ', {
  variants: {
    variant: {
      green:
        'border-SuccessGreenStroke bg-SuccessGreenBg text-SuccessGreenText',
      orange:
        'border-WarningOrangeStroke bg-WarningOrangeBg text-WarningOrangeText',
      red:
        'border-DangerRedStroke bg-DangerRedBg text-DangerRedText',
      blue: 'border-BrandBlueStroke bg-BrandBlueBg text-BrandBlueText',
    },
  },
  defaultVariants: {
    variant: 'green',
  },
});

export interface MarkerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof markerVariants> {}

function Marker({ className, variant, ...props }: MarkerProps) {
  return (
    <div>
      <p className={cn(markerVariants({ variant }), className)} {...props}></p>
    </div>
  );
}

export { Marker, markerVariants };
