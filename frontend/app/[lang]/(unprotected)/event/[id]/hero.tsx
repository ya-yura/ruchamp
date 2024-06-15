'use client';

import { ContentWraper } from '@/components/content-wraper';
import { CustomSection } from '@/components/custom-section';
import { useScrollY } from '@/lib/hooks/useScrollY';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Badges } from './badges';
import { H1 } from '@/components/text';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Locale } from '@/i18n.config';
import { usePathname, useRouter } from 'next/navigation';
import { path } from '@/lib/utils/other-utils';
import { fallbackImage } from '@/lib/constants';

interface HeroProps {
  id: number;
  title: string;
  badges: string[];
  buttons: ReactNode;
  image: string;
  isOwner: boolean;
  tabsData: Record<string, string>;
  lang: Locale;
}

export function Hero({
  id,
  title,
  badges,
  buttons,
  image,
  isOwner,
  tabsData,
  lang,
}: HeroProps) {
  const pathname = usePathname();
  const [selectedTabValue, setSelectedTabValue] = useState<string>(
    pathname.split('/')[3],
  );
  const refContainer = useRef<HTMLDivElement | null>(null);
  const [scrollY] = useScrollY();
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const imageUrl = image.startsWith('http')
    ? image
    : `${baseUrl}/${image}` || fallbackImage;

  let progress = 0;
  const { current: elContainer } = refContainer;
  if (elContainer) {
    progress = Math.min(1, scrollY / elContainer.clientHeight);
  }

  useEffect(() => {
    setSelectedTabValue(pathname.split('/')[3]);
  }, [pathname]);

  const onTabSelect = useCallback(
    (value: string) => {
      setSelectedTabValue(value);
      router.push(path(lang, `/event/${id}/${value}`));
    },
    [id, lang],
  );

  return (
    <div className="w-full">
      <div
        className={cn(
          `absolute mt-[-92px] flex h-[720px] w-full items-end overflow-hidden`,
        )}
        ref={refContainer}
      >
        <Image
          className=""
          src={imageUrl}
          alt="Обложка"
          fill={true}
          style={{
            objectFit: 'cover',
            transform: `translateY(${8 - progress * 15}vh)`,
            backgroundPosition: 'top',
            scale: '130%',
          }}
        />
        <div className="bottom-0 left-0 right-0 top-0 h-full w-full bg-primary-almostBlack opacity-50"></div>
      </div>
      <CustomSection className="relative h-[590px] items-start  bg-transparent">
        <ContentWraper className="h-[590px] justify-between">
          <Badges types={badges} />
          <div className="relative flex flex-col gap-10">
            <div>
              <H1 className="inline">{title}</H1>
              {isOwner && (
                <Button variant={'ghost'}>
                  <Image
                    className="ml- inline"
                    src={'/images/icons/pencil.svg'}
                    alt=""
                    width={32}
                    height={32}
                  />
                </Button>
              )}
            </div>
            {buttons}
          </div>
        </ContentWraper>
      </CustomSection>
      <CustomSection className="relative">
        <ContentWraper>
          <Tabs
            defaultValue={Object.keys(tabsData)[0]}
            className="mb-10 mt-[-38px] w-full"
            onValueChange={onTabSelect}
            value={selectedTabValue}
          >
            <ScrollArea className="-mx-4 w-screen sm:mx-0 sm:w-full">
              <TabsList className="mb-10 flex w-fit justify-between bg-transparent text-text-mutedLight sm:mx-auto">
                {Object.entries(tabsData).map(([key, value]) => (
                  <TabsTrigger
                    key={key}
                    className={cn(
                      'first-of-type:ml-4 last-of-type:mr-4',
                      'sm:first-of-type:ml-0 sm:last-of-type:mr-0',
                    )}
                    value={key}
                  >
                    {value}
                  </TabsTrigger>
                ))}
              </TabsList>
              <ScrollBar className="hidden" orientation="horizontal" />
            </ScrollArea>
          </Tabs>
        </ContentWraper>
      </CustomSection>
    </div>
  );
}
