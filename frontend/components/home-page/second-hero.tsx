import Image from 'next/image';
import boxerSvg from '@/public/ru/images/boxer.svg';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Locale } from '@/i18n.config';

export function SecondHero({ lang }: { lang: Locale }) {
  return (
    <section className="relative flex h-[500px] w-full overflow-hidden bg-[#000000]">
      <Image
        className="relative -left-[100px] top-[0] w-full"
        src={boxerSvg}
        alt={`Боксёр`}
        width={945}
        height={500}
      />
      <div className="flex w-full flex-col justify-center">
        <h2 className="to-53% mb-5 max-w-[550px] bg-gradient-to-r from-[#95CEFF] from-25% to-[#0F6CBD] bg-clip-text text-[40px] font-bold leading-[47px] tracking-wide text-transparent">
          Ваш путь к победе начинается здесь
        </h2>
        <p className="mb-6 max-w-[550px] text-sm leading-[24px] text-white opacity-60">
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
