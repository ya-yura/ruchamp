'use client';

import Image from 'next/image';
import { Locale } from '@/i18n.config';
import { ContentWraper } from '../content-wraper';

export function SupportedSection({ lang }: { lang: Locale }) {
  return (
    <section className="mb-[90px] w-full">
      <ContentWraper className="max-w-7xl flex-row gap-[115px] pl-[70px]">
        <a href="https://fasie.ru/">
          {' '}
          <Image
            src={'/images/logo_fund.svg'}
            width={200}
            height={98}
            alt="Логотип партнера"
          />
        </a>

        <p className="max-w-[585px] text-base text-background">
          Проект создан при поддержке Фонда Содействия Инноваций
          <br />в рамках федерального проекта
          <br />
          «Платформа университетского технологического предпринимательства»
        </p>
      </ContentWraper>
    </section>
  );
}
