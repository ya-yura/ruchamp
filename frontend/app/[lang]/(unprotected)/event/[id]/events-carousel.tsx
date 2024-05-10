'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Event } from '@/lib/definitions';
import { BigCardWithImage } from '../../events/card-event';
import React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { transformDate } from '@/lib/utils';

export function EventsCarousel({ events }: { events: Event[] }) {
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
              title={transformDate(event.start_datetime)}
              subtitle={event.location}
              description={event.description}
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
