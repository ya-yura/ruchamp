import { Button } from '@/components/ui/button';
import React from 'react';

export function TeamActionButtons() {
  return (
    <div className="mb-[87px] flex gap-6">
      <Button variant="ruchampDefault">Вступить</Button>
      <Button variant="ruchampTransparent">Переназначить капитана</Button>
    </div>
  );
}
