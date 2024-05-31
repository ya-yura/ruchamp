import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React from 'react';

interface EventActionButtonsProps {
  isOwner?: boolean;
}

export function EventActionButtons({ isOwner }: EventActionButtonsProps) {
  if (isOwner) {
    return (
      <div className="mb-[87px] flex gap-6">
        <Button variant="ruchampDefault">Изменить</Button>
        <Button className="group" variant="ruchampTransparent">
          <Image
            className="mr-3 group-hover:invert"
            src={'/images/icons/change-poster.svg'}
            alt=""
            width={20}
            height={20}
          />
          <p className="text-base font-semibold">Сменить афишу</p>
        </Button>
      </div>
    );
  }

  return (
    <div className="mb-[87px] flex gap-6">
      <Button variant="ruchampDefault">Участвовать</Button>
      <Button variant="ruchampTransparent">Купить билеты</Button>
    </div>
  );
}
