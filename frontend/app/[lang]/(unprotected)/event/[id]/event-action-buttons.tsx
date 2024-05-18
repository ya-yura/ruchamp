import { Button } from '@/components/ui/button';
import React from 'react';

export function EventActionButtons() {
  return (
    <div className="mb-[87px] flex gap-6">
      <Button variant="ruchampDefault">Участвовать</Button>
      <Button variant="ruchampTransparent">Купить билеты</Button>
    </div>
  );
}
