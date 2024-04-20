import Image from 'next/image';
import boxerSvg from '@/public/ru/images/boxer.svg';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Locale } from '@/i18n.config';

export function SecondHero({ lang }: { lang: Locale }) {
  return (
    <section className="relative flex h-fit w-full flex-col justify-end overflow-hidden bg-[#000000] sm:h-[500px] sm:flex-row">
      <Image
        className="relative left-[-65px] top-[0] h-[285px] max-w-fit sm:absolute sm:left-[-450px] sm:h-full sm:w-fit sm:max-w-full md:left-[-310px] lg:left-[-200px] xl:left-[-100px]"
        src={boxerSvg}
        alt={`Боксёр`}
        width={945}
        height={500}
      />
      <div className="sm: relative flex w-fit flex-col justify-center bg-[#0A0A0A] p-10 sm:mr-5 sm:w-3/5 sm:bg-transparent sm:p-0 md:w-1/2 xl:mr-0">
        <h2 className="to-53% mb-5 max-w-[550px] bg-gradient-to-r from-[#95CEFF] from-25% to-[#0F6CBD] bg-clip-text text-2xl font-black leading-7 tracking-wide text-transparent sm:text-4xl sm:leading-[47px] md:text-[40px]">
          Ваш путь к победе начинается здесь
        </h2>
        <p className="mb-6 max-w-[550px] text-sm  text-[#C9C9C9] sm:leading-[24px] md:text-base lg:text-lg">
          С нами вы сможете оптимизировать свою работу, улучшить результаты и
          достичь новых высот в спорте. Не упустите свой шанс присоединиться к
          нашему сообществу и стать частью большой спортивной семьи!
        </p>
        <Link href={`/${lang}/login`}>
          <Button variant="ruchampDefault" type="button">
            Присоединиться
          </Button>
        </Link>
      </div>
    </section>
  );
}
