'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Locale } from '@/i18n.config';
import { CustomLink } from '../custom-link';

interface BigCardWithImageAthlete {
  type: 'event';
  id: number;
  name: string;
  date: string;
  location: string;
  lang: Locale;
  className?: string;
}

export function BigCardWithImageAthlete({
  type,
  id,
  name,
  date,
  location,
  lang,
  className,
}: BigCardWithImageAthlete) {
  const [isLiked, setIsLiked] = useState<boolean>(false);

  return (
    <li
      className={cn(
        'group flex  h-[244px] w-[269px] cursor-default flex-col gap-3 justify-between overflow-hidden p-3',
        'rounded-md bg-card-background transition-all hover:scale-[101%] hover:shadow-cardShadow',
        className,
      )}
    >
      <div className="relative h-[100%] w-full">
        <Image
          src={`/ru/images/mock-${type}-bg/${id.toString()[id.toString().length - 1]}.avif`}
          alt={name}
          fill={true}
          style={{ objectFit: 'cover', borderRadius: '3px' }}
        />
        <div className="absolute left-0 top-0 h-full w-full bg-card-background opacity-70"></div>
      </div>
      <div className="flex flex-col justify-between ">
        <div className="flex items-center justify-start gap-5">
          <div className="m-0 flex h-[30px] w-[30px] items-center justify-center p-0">
            <Image
              src="/ru/images/icon-loop.png"
              alt={'Иконка'}
              width={25}
              height={25}
            />
          </div>
          <div className="flex flex-col">
            <CustomLink
              lang={lang}
              href={`/${type}/${id}${type === 'event' ? '/info' : ''}`}
            >
              <h3 className="relative mx-auto  line-clamp-3 text-sm font-bold text-background">
                {name}
              </h3>
            </CustomLink>
            <p className="line-clamp-1 text-[10px] text-neutralForeground3">
              {date}, {location}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}
