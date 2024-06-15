'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Event } from '@/lib/definitions';
import { BigCardWithImage } from '@/components/cards/big-card-with-image';
import React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { transformDate } from '@/lib/utils/date-and-time';
import { Locale } from '@/i18n.config';

export function EventsCarousel({
  events,
  lang,
}: {
  events: Event[];
  lang: Locale;
}) {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true }),
  );

  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      plugins={[plugin.current]}
      className="w-full"
    >
      <CarouselContent className="py-2">
        {events.map((event) => (
          <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1/3">
            <BigCardWithImage
              key={event.id}
              type="event"
              id={event.id}
              name={event.name}
              tags={event.sports_in_matches.join(', ')}
              title={transformDate(event.start_datetime)}
              subtitle={event.location}
              description={event.description}
              image={event.image_field}
              lang={lang}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious
        className="left-3 h-12 w-12 text-background"
        variant="ghost"
      />
      <CarouselNext
        className="right-3 h-12 w-12 text-background"
        variant="ghost"
      />
    </Carousel>
  );
}
