'use client';

import Image from 'next/image';
import { ReactNode, useEffect, useRef } from 'react';
import { Badges } from '../app/[lang]/(unprotected)/event/[id]/badges';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useScrollY } from '@/lib/hooks/useScrollY';
import { CustomSection } from '@/components/custom-section';
import { cn } from '@/lib/utils';
import { H1 } from '@/components/text';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ContentWraper } from '@/components/content-wraper';
import { Locale } from '@/i18n.config';
import { Button } from './ui/button';
import { fallbackImage } from '@/lib/constants';

interface PageWithInfoProps<T extends string> {
  id: number;
  type: 'event' | 'team';
  title: string;
  bages: string[];
  buttons: ReactNode;
  image: string;
  tabsContent: Record<T, ReactNode>;
  tabsObj: Record<string, T>;
  isOwner?: boolean;
  lang: Locale;
}

export function PageWithInfo<T extends string>({
  id,
  type,
  title,
  bages,
  buttons,
  image,
  tabsContent,
  tabsObj,
  isOwner,
  lang,
}: PageWithInfoProps<T>) {
  const refContainer = useRef<HTMLDivElement | null>(null);
  const [scrollY] = useScrollY();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const imageUrl = image.startsWith('http')
    ? image
    : `${baseUrl}/${image}` || fallbackImage;

  let progress = 0;

  const { current: elContainer } = refContainer;
  if (elContainer) {
    progress = Math.min(1, scrollY / elContainer.clientHeight);
  }

  return (
    <div className="w-full">
      <div
        className={cn(
          `absolute mt-[-92px] flex h-[720px] w-full items-end overflow-hidden`,
        )}
        ref={refContainer}
      >
        <Image
          // src={`/ru/images/mock-${type}-bg/${id.toString()[id.toString().length - 1]}.avif`}
          src={imageUrl}
          alt={title}
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
          <Badges types={bages} />
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
            defaultValue={Object.keys(tabsObj)[0]}
            className="mb-10 mt-[-38px] w-full"
          >
            <ScrollArea className="-mx-4 w-screen sm:mx-0 sm:w-full">
              <TabsList className="mb-10 flex w-fit justify-between bg-transparent text-text-mutedLight sm:mx-auto">
                {Object.entries(tabsObj).map(([key, value]) => (
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
            {Object.entries(tabsObj).map(([key, value]) => (
              <TabsContent key={key} value={key}>
                {tabsContent[value as T]}
              </TabsContent>
            ))}
          </Tabs>
        </ContentWraper>
      </CustomSection>
    </div>
  );
}
