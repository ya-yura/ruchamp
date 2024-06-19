'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { Button, ButtonProps } from './ui/button';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  variant?: ButtonProps['variant'];
  className?: string;
}

export function BackButton({
  className,
  variant = 'ruchampTransparentGreyBorder',
}: BackButtonProps) {
  const router = useRouter();
  return (
    <Button
      className={cn('', className)}
      variant={variant}
      onClick={() => router.back()}
      type='button'
    >
      ← Назад
    </Button>
  );
}
