import { DeleteEventDialog } from '@/components/dialogs/delete-event';
import { UpdateEventDialog } from '@/components/dialogs/update-event';
import { UpdateEventImageDialog } from '@/components/dialogs/update-event-image';
import { Button } from '@/components/ui/button';
import { Locale } from '@/i18n.config';
import { Event } from '@/lib/definitions';
import React from 'react';

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
        <UpdateEventDialog
          token={token}
          eventId={event.id}
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
        <UpdateEventImageDialog eventId={event.id} token={token} lang={lang} />
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
