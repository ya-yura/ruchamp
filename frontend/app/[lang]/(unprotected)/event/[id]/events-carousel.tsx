import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { TypeEvent } from '@/lib/definitions';
import { CardEvent } from '../../events/card-event';
import React from 'react';
import Autoplay from 'embla-carousel-autoplay';

export function EventsCarousel({ events }: { events: Array<TypeEvent> }) {
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
      <CarouselContent>
        {events.map((event) => (
          <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1/3">
            <CardEvent
              className="hover:scale-100 hover:shadow-none"
              key={event.id}
              event={event}
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
