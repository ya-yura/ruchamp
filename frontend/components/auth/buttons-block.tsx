import { cn } from '@/lib/utils';
import React from 'react';

interface ButtonsBlockProps {
  className?: string;
  children: React.ReactNode;
}

export function ButtonsBlock({ className, children }: ButtonsBlockProps) {
  return <div className={cn('flex flex-col sm:flex-row items-center justify-between gap-4', className)}>{children}</div>;
}
