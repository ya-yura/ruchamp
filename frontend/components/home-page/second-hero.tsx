'use client';

import Image from 'next/image';
import boxerBgOne from '@/public/ru/images/pages/home/boxer-bg-one.svg';
import boxerBgTwo from '@/public/ru/images/pages/home/boxer-bg-two.svg';
import boxerBgThree from '@/public/ru/images/pages/home/boxer-bg-three.svg';
import boxerBgFour from '@/public/ru/images/pages/home/boxer-bg-four.svg';
import { Button } from '../ui/button';
import { Locale } from '@/i18n.config';
import { CustomLink } from '../custom-link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { BoxerSVG } from './boxer/boxer-svg';

export function SecondHero({ lang }: { lang: Locale }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isInView, setIsInView] = useState(false);
  const [isBlinked, setIsBlinked] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const animationFrameId = useRef<number>();
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Store raw mouse position
      lastMousePos.current = {
        x: (e.clientX / window.innerWidth) * 20 - 10,
        y: (e.clientY / window.innerHeight) * 20 - 10,
      };
    };

    // Throttled animation update
    const updatePosition = () => {
      // Smooth lerp animation
      const lerp = (start: number, end: number, factor: number) =>
        start + (end - start) * factor;

      setMousePosition((prev) => ({
        x: lerp(prev.x, lastMousePos.current.x, 0.1),
        y: lerp(prev.y, lastMousePos.current.y, 0.1),
      }));

      animationFrameId.current = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationFrameId.current = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isInView]);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinked(true);
      setTimeout(() => setIsBlinked(false), 300);
    }, 8000);

    return () => clearInterval(blinkInterval);
  }, []);

  const handleClick = useCallback(() => {
    setIsBlinked(true);
    setTimeout(() => setIsBlinked(false), 300);
  }, []);

  return (
    <section
      className="relative flex h-fit w-full transform flex-col justify-end overflow-hidden bg-[#000000] md:h-[500px] md:flex-row"
      ref={sectionRef}
      onClick={handleClick}
    >
      <div className="pointer-events-none relative aspect-[1.4] w-full md:aspect-auto md:w-1/2">
        <div className="absolute -top-[6%] left-[45%] aspect-square w-full -translate-x-1/2 sm:left-1/2 md:left-[3%] md:aspect-auto md:h-[657px] md:w-[645px] lg:left-[35%]">
          <Image
            className="absolute -top-[0] left-0"
            style={{
              transform: `translate(${mousePosition.x * 0.2}px, ${mousePosition.y * 0.2}px)`,
            }}
            src={boxerBgFour}
            alt=""
            width={645}
            height={657}
          />
          <Image
            className="absolute left-[19%] top-[14%]"
            style={{
              transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
            }}
            src={boxerBgThree}
            alt=""
            width={454}
            height={532}
          />
          <Image
            className="absolute -left-[9%] top-[25%]"
            style={{
              transform: `translate(${mousePosition.x * 0.8}px, ${mousePosition.y * 0.8}px)`,
            }}
            src={boxerBgTwo}
            alt=""
            width={475}
            height={500}
          />
          <Image
            className="absolute left-[12%] top-[37%]"
            style={{
              transform: `translate(${mousePosition.x * 1.5}px, ${mousePosition.y}px)`,
            }}
            src={boxerBgOne}
            alt=""
            width={238}
            height={316}
          />
        </div>
        <div
          className="absolute left-0 top-[6%] aspect-[0.9] w-[80%] sm:left-[6%] md:-left-[15%] md:aspect-auto lg:-left-[4%] xl:left-[13%] 2xl:left-[17%]"
          style={{
            transform: `translate(${mousePosition.x * 3}px, ${mousePosition.y}px)`,
          }}
        >
          <BoxerSVG
            className="boxer-movement h-full w-full md:h-auto md:w-auto"
            isBlinked={isBlinked}
          />
        </div>
      </div>
      <div className="relative flex w-full flex-col justify-center bg-[#0A0A0A] p-10 md:mr-5 md:w-1/2 md:bg-transparent md:p-0 xl:mr-0">
        <h2 className="to-53% mb-5 max-w-[550px] bg-gradient-to-r from-[#95CEFF] from-25% to-[#0F6CBD] bg-clip-text text-2xl font-black leading-7 tracking-wide text-transparent sm:text-4xl sm:leading-[47px] md:text-[40px]">
          Ваш путь к победе начинается здесь
        </h2>
        <p className="mb-6 max-w-[550px] text-sm text-background sm:leading-[24px] md:text-base lg:text-lg">
          С нами вы сможете оптимизировать свою работу, улучшить результаты и
          достичь новых высот в спорте. Не упустите свой шанс присоединиться к
          нашему сообществу и стать частью большой спортивной семьи!
        </p>
        <CustomLink href={`/login`} lang={lang}>
          <Button variant="ruchampDefault" type="button">
            Присоединиться
          </Button>
        </CustomLink>
      </div>
    </section>
  );
}
