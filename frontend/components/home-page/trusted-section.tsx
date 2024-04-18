'use client';

import React from 'react';
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';
import AutoScroll from 'embla-carousel-auto-scroll';
import Image from 'next/image';

export function TrustedSection() {
  const plugin1 = React.useRef(
    AutoScroll({ playOnInit: true, stopOnInteraction: true, speed: 0.6 }),
  );
  const plugin2 = React.useRef(
    AutoScroll({ playOnInit: true, stopOnInteraction: true, speed: 0.1 }),
  );
  const plugin3 = React.useRef(
    AutoScroll({ playOnInit: true, stopOnInteraction: true, speed: 0.3 }),
  );

  return (
    <section className="relative flex h-[500px] w-full flex-col bg-gradient-to-b from-[#0A0A0A] py-20">
      <h1 className="to-53% mb-5 ml-[140px] bg-gradient-to-r from-[#95CEFF] from-25% to-[#0F6CBD] bg-clip-text text-[40px] font-bold leading-[47px] tracking-wide text-transparent">
        Нам доверяют
      </h1>
      <div className="flex w-full flex-col gap-5">
        <Carousel
          opts={{
            align: 'start',
            loop: true,
            dragFree: true,
          }}
          plugins={[plugin1.current]}
          className="w-full"
        >
          <CarouselContent>
            {Array.from({ length: 10 }).map((_, index) => (
              <CarouselItem className="basis-1/7 h-[72px]" key={index}>
                <Image
                  src={`/ru/images/mock-trusted-logos/${index + 1}.svg`}
                  alt={`Логотип компании ${index + 1}`}
                  width={198}
                  height={72}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
            dragFree: true,
          }}
          plugins={[plugin2.current]}
          className="w-full"
        >
          <CarouselContent>
            {Array.from({ length: 9 }).map((_, index) => (
              <CarouselItem className="basis-1/7 h-[72px]" key={index}>
                <Image
                  src={`/ru/images/mock-trusted-logos/${index + 2}.svg`}
                  alt={`Логотип компании ${index + 1}`}
                  width={198}
                  height={72}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
            dragFree: true,
          }}
          plugins={[plugin3.current]}
          className="w-full"
        >
          <CarouselContent>
            {Array.from({ length: 10 }).map((_, index) => (
              <CarouselItem className="basis-1/7 h-[72px]" key={index}>
                <Image
                  src={`/ru/images/mock-trusted-logos/${index + 3}.svg`}
                  alt={`Логотип компании ${index + 1}`}
                  width={198}
                  height={72}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
