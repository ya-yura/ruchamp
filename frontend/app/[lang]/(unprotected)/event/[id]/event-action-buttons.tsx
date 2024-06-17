import { DeleteEventDialog } from '@/components/dialogs/delete-event';
import { UpdateEventDialog } from '@/components/dialogs/update-event';
import { Button } from '@/components/ui/button';
import { Locale } from '@/i18n.config';
import { Event } from '@/lib/definitions';
import Image from 'next/image';
import React, { useState } from 'react';

interface EventActionButtonsProps {
  event: Event;
  token?: string;
  isOwner?: boolean;
  lang: Locale;
}

export function EventActionButtons({
  event,
  token,
  isOwner,
  lang,
}: EventActionButtonsProps) {
  if (isOwner) {
    return (
      <div className="mb-[87px] flex gap-6">
        {/* <Button variant="ruchampDefault">Изменить</Button> */}
        <UpdateEventDialog
          token={token}
          name={event.name}
          start_datetime={event.start_datetime}
          end_datetime={event.end_datetime}
          start_request_datetime={event.start_request_datetime}
          end_request_datetime={event.end_request_datetime}
          location={event.location}
          geo={event.geo}
          description={event.description}
          lang={lang}
        />
        <DeleteEventDialog eventId={event.id} token={token} lang={lang} />
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
