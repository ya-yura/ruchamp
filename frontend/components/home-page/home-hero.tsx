import Image from 'next/image';
import { ContentWraper } from '@/components/content-wraper';
import { Button } from '@/components/ui/button';
import linesSvg from '@/public/ru/images/home-page-hero-lines.svg';
import Link from 'next/link';
import { Locale } from '@/i18n.config';

export function HomeHero({ lang }: { lang: Locale }) {
  return (
    // <section className="relative mt-[-92px] flex h-[680px] w-full flex-col items-center justify-between overflow-hidden bg-[#0a0a0a] px-[72px] pt-[92px]">
    <section className="relative mt-[-92px] flex w-full flex-col items-center justify-between overflow-hidden bg-[#0a0a0a] px-7 pb-12 pt-[92px] lg:h-[680px] lg:px-[72px] lg:pb-0">
      <ContentWraper className="relative h-full justify-between">
        <Image
          // className="absolute -right-[70px] -top-[92px]"
          className="absolute -top-[190px] right-0 rotate-90 scale-[2.1] sm:scale-[1.5] md:rotate-0 lg:-right-[70px] lg:-top-[92px]"
          src={linesSvg}
          alt={`Фоновые линии`}
          width={702}
          height={689}
        />
        <Image
          // className="absolute -right-[18px] top-[22px]"
          className="relative right-0 top-0 ml-auto lg:absolute lg:-right-[18px] lg:top-[22px]"
          src="/ru/images/home-page-hero-better.png"
          alt={`Боец выходит на ринг`}
          width={524}
          height={455}
        />
        <div className="relative flex flex-col md:mt-[-333px] lg:mt-0">
          <h1
            // className="drop-shadow-contrastText mb-11 mt-[70px] text-[40px] font-bold leading-[47px] tracking-wide"
            className="drop-shadow-contrastText ld:order-0 mb-8 mt-8 text-3xl font-bold leading-[40px] tracking-wide sm:text-4xl md:order-1 lg:mb-11 lg:mt-[70px] lg:text-[40px] lg:leading-[47px]"
          >
            Новые{' '}
            <span className="to-53% bg-gradient-to-r from-[#95CEFF] from-25% to-[#0F6CBD] bg-clip-text text-transparent">
              вызовы
            </span>{' '}
            каждый день <br />
            <span className="to-53% bg-gradient-to-r from-[#95CEFF] from-25% to-[#0F6CBD] bg-clip-text text-transparent">
              Поможем
            </span>{' '}
            быть готовым к ним
          </h1>
          <p className="drop-shadow-contrastText ld:order-1 mb-8 w-full text-sm font-normal leading-[20px] md:order-2 lg:mb-[66px] lg:max-w-[460px] lg:text-base lg:leading-[26px]">
            Наша миссия - создать платформу, которая сделает мир боевых искусств
            доступным для всех, помогая спортсменам достигать новых высот и
            делая соревнования захватывающими и запоминающимися событиями.
          </p>
          <div className="md:order-0 flex gap-5 md:mb-[207px] lg:order-3 lg:mb-0">
            <Link href={`/${lang}/login`}>
              <Button variant="ruchampDefault" type="button">
                Создать событие
              </Button>
            </Link>
            <svg
              width="46"
              height="38"
              viewBox="0 0 46 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M43.8334 19L2.16669 19M43.8334 19L27.1667 35.6667M43.8334 19L27.1667 2.33337"
                stroke="#0F6CBD"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </ContentWraper>
    </section>
  );
}
