'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export function BackButton({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <Button
      className={cn('', className)}
      variant={'ruchampTransparentGreyBorder'}
      onClick={() => router.back()}
    >
      ← Назад
    </Button>
  );
}
