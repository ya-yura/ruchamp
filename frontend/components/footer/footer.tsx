import { LinkData1, LinkData2, LinkData3 } from './constants';
import { CustomLink } from '../custom-link';
import { Locale } from '@/i18n.config';
import { ContentWraper } from '../content-wraper';
import { Separator } from '../ui/separator';

export function Footer({ lang }: { lang: Locale }) {
  return (
    <footer className="relative flex w-full flex-col bg-primary-background px-4 py-3 pb-6 sm:px-7 md:px-10 lg:px-[72px]">
      <ContentWraper>
        <div className="mb-8">
          <Separator className="bg-[#3D3D3D]" />
        </div>
        <nav className="mb-6 flex flex-col items-start justify-between gap-10 sm:mb-0 sm:flex-row md:justify-start md:gap-36">
          <div className="mb-0 flex flex-col gap-5 sm:mb-11">
            <h4 className="text-xl font-bold text-[#616161]">РуЧамп</h4>
            <ul className="flex flex-col gap-2">
              {LinkData1.map((item) => (
                <li key={item.text}>
                  <CustomLink
                    className="text-base font-normal text-[#424242] transition-colors hover:text-neutral-400"
                    href={item.url}
                    lang={lang}
                  >
                    {item.text}
                  </CustomLink>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-5">
            <h4 className="text-xl font-bold text-[#616161]">
              Партнёрам и организаторам
            </h4>
            <ul className="flex flex-col gap-2">
              {LinkData2.map((item) => (
                <li key={item.text}>
                  <CustomLink
                    className="text-base font-normal text-[#424242] transition-colors hover:text-neutral-400"
                    href={item.url}
                    lang={lang}
                  >
                    {item.text}
                  </CustomLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        <Separator className="mb-4 bg-[#3D3D3D] sm:hidden" />
        <div className="flex flex-col items-start justify-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
          <ul className="flex flex-col gap-3 sm:flex-row md:gap-9">
            {LinkData3.map((item) => (
              <li key={item.text}>
                <CustomLink
                  className="text-xs font-normal text-[#424242] transition-colors hover:text-neutral-400"
                  href={item.url}
                  lang={lang}
                >
                  {item.text}
                </CustomLink>
              </li>
            ))}
          </ul>
          <p className="text-xs font-normal text-[#424242]">
            © 2024 — «РуЧамп»
          </p>
        </div>
      </ContentWraper>
    </footer>
  );
}
