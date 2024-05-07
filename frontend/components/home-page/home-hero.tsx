import Image from 'next/image';
import { ContentWraper } from '@/components/content-wraper';
import { Button } from '@/components/ui/button';
import linesSvg from '@/public/ru/images/home-page-hero-lines.svg';
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/lib/dictionary';
import { CustomLink } from '../custom-link';

export async function HomeHero({ lang }: { lang: Locale }) {
  const { page } = await getDictionary(lang);
  const hero = page.home.hero;

  return (
    <section className="sm: relative mt-[-92px] flex w-full flex-col items-center justify-between overflow-hidden bg-[#0a0a0a] px-4 pb-12 pt-[92px] sm:px-6 lg:h-[680px] lg:px-[72px] lg:pb-0">
      <ContentWraper className="relative h-full justify-between">
        <Image
          className="absolute -top-[190px] right-0 rotate-90 scale-[2.1] sm:scale-[1.5] md:rotate-0 lg:-right-[70px] lg:-top-[92px]"
          src={linesSvg}
          alt=""
          width={702}
          height={689}
        />
        <Image
          className="relative right-0 top-0 ml-auto lg:absolute lg:-right-[18px] lg:top-[22px]"
          src="/ru/images/home-page-hero-better.png"
          alt=""
          width={524}
          height={455}
        />
        <div className="relative flex flex-col md:mt-[-333px] lg:mt-0">
          <h1 className="ld:order-0 mb-8 mt-8 rounded-xl bg-black p-4 text-3xl font-bold leading-[32px] tracking-wide text-background drop-shadow-contrastText sm:rounded-none sm:bg-transparent sm:p-0 sm:text-4xl md:order-1 lg:mb-11 lg:mt-[70px] lg:text-[40px] lg:leading-[47px]">
            {hero.title}{' '}
            <span className="to-53% bg-gradient-to-r from-[#95CEFF] from-25% to-[#0F6CBD] bg-clip-text text-transparent">
              {hero.title1}
            </span>{' '}
            {hero.title2} <br /> <br className="block h-3 sm:hidden" />
            <span className="to-53% bg-gradient-to-r from-[#95CEFF] from-25% to-[#0F6CBD] bg-clip-text text-transparent">
              {hero.title3}
            </span>{' '}
            {hero.title4}
          </h1>
          <p className="ld:order-1 mb-8 w-full text-sm font-normal leading-[20px] text-background drop-shadow-contrastText md:order-2 lg:mb-[66px] lg:max-w-[460px] lg:text-base lg:leading-[26px]">
            {hero.mission}
          </p>
          <div className="md:order-0 flex gap-5 md:mb-[207px] lg:order-3 lg:mb-0">
            <CustomLink href={`/login`} lang={lang}>
              <Button variant="ruchampDefault" type="button">
                {hero.buttonText}
              </Button>
            </CustomLink>
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
