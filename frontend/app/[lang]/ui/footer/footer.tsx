import { Divider } from '@fluentui/react-components';
import { LinkData1, LinkData2, LinkData3 } from './constants';
import { CustomLink } from '../custom-link';
import { Locale } from '@/i18n.config';

export function Footer({ lang }: { lang: Locale }) {
  return (
    <footer className="flex w-full flex-col bg-[#0a0a0a] px-[72px] pb-6">
      <div className="mb-8">
        <Divider />
      </div>
      <nav className="flex items-start justify-start gap-36">
        <div className="mb-11 flex flex-col gap-5">
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
      <div className="flex items-center justify-between">
        <ul className="flex gap-9">
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
        <p className="text-xs font-normal text-[#424242]">© 2024 — «РуЧамп»</p>
      </div>
    </footer>
  );
}
