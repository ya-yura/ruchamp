import { DeleteEventDialog } from '@/components/dialogs/delete-event';
import { Button } from '@/components/ui/button';
import { Locale } from '@/i18n.config';
import Image from 'next/image';
import React, { useState } from 'react';

interface EventActionButtonsProps {
  eventId?: number;
  token?: string;
  isOwner?: boolean;
  lang: Locale;
}

export function EventActionButtons({ eventId, token, isOwner, lang }: EventActionButtonsProps) {
  if (isOwner) {
    return (
      <div className="mb-[87px] flex gap-6">
        <Button variant="ruchampDefault">Изменить</Button>
        {/* <Button variant="ruchampTransparentGreyBorder">Удалить</Button> */}
        <DeleteEventDialog eventId={eventId} token={token} lang={lang} />
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
