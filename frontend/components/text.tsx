import React from 'react';
import { cn } from '@/lib/utils';

interface TextProps {
  children: React.ReactNode;
  className?: string;
}

export function H1({ children, className }: TextProps) {
  return (
    <h1
      className={cn(
        'text-4xl font-bold leading-tight tracking-tight text-background lg:text-5xl',
        className,
      )}
    >
      {children}
    </h1>
  );
}

export function H2({ children, className }: TextProps) {
  return (
    <h2
      className={cn(
        'text-xl font-bold text-foreground md:text-2xl lg:text-4xl',
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function H3({ children, className }: TextProps) {
  return (
    <h3
      className={cn(
        'text-3xl font-bold text-foreground lg:text-4xl',
        className,
      )}
    >
      {children}
    </h3>
  );
}

export function H4({ children, className }: TextProps) {
  return (
    <h4
      className={cn(
        'text-lg font-semibold text-background sm:text-base md:text-lg',
        className,
      )}
    >
      {children}
    </h4>
  );
}

export function H5({ children, className }: TextProps) {
  return (
    <h4
      className={cn('text-sm font-bold text-foreground sm:text-lg', className)}
    >
      {children}
    </h4>
  );
}

export function PersonNameOnCard({ children, className }: TextProps) {
  return (
    <p
      className={cn(
        'text-neutralForeground3Rest text-base font-semibold',
        className,
      )}
    >
      {children}
    </p>
  );
}

export function PersonDescriptionOnCard({ children, className }: TextProps) {
  return (
    <p className={cn('text-neutralForeground3Rest text-sm', className)}>
      {children}
    </p>
  );
}
