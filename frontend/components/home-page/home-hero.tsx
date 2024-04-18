import Image from 'next/image';
import { ContentWraper } from '@/components/content-wraper';
import { Button } from '@/components/ui/button';
import linesSvg from '@/public/ru/images/home-page-hero-lines.svg';
import Link from 'next/link';
import { Locale } from '@/i18n.config';

export function HomeHero({ lang }: { lang: Locale }) {
  return (
    <section className="relative mt-[-92px] flex h-[680px] w-full flex-col items-center justify-between overflow-hidden bg-[#0a0a0a] px-[72px] pt-[92px]">
      <ContentWraper className=" relative h-full justify-between">
        <Image
          className="absolute -right-[70px] -top-[92px]"
          src={linesSvg}
          alt={`Фоновые линии`}
          width={702}
          height={689}
        />
        <Image
          className="absolute -right-[18px] top-[22px]"
          src="/ru/images/home-page-hero-better.png"
          alt={`Боец выходит на ринг`}
          width={524}
          height={455}
        />
        <div className="flex flex-col">
          <h1 className="mb-11 mt-[70px] text-[40px] font-bold leading-[47px] tracking-wide">
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
          <p className="mb-[66px] max-w-[460px] text-base font-normal leading-[26px]">
            Наша миссия - создать платформу, которая сделает мир боевых искусств
            доступным для всех, помогая спортсменам достигать новых высот и
            делая соревнования захватывающими и запоминающимися событиями.
          </p>
          <div className="flex gap-5">
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
