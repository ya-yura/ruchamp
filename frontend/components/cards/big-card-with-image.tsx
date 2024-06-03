'use client';

import { Button } from '@/components/ui/button';
import { path } from '@/lib/utils/other-utils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Locale } from '@/i18n.config';
import { CustomLink } from '../custom-link';

interface BigCardWithImage {
  type: 'event' | 'team';
  id: number;
  name: string;
  tags: string;
  title: string;
  subtitle: string;
  description: string;
  lang: Locale;
  className?: string;
}

export function BigCardWithImage({
  type,
  id,
  name,
  tags,
  title,
  subtitle,
  description,
  lang,
  className,
}: BigCardWithImage) {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const router = useRouter();

  return (
    <li
      className={cn(
        'group flex h-[450px] w-full cursor-default flex-col overflow-hidden pb-3',
        'rounded-xl bg-[#292929] transition-all hover:scale-[101%] hover:shadow-cardShadow',
        className,
      )}
    >
      <div className="relative h-[60%] w-full px-9 py-8">
        <Image
          className="opacity-30"
          src={`/ru/images/mock-${type}-bg/${id.toString()[id.toString().length - 1]}.avif`}
          alt={name}
          fill={true}
          style={{ objectFit: 'cover' }}
        />
        <h3 className="relative mx-auto mb-3 line-clamp-3 text-4xl font-bold text-background">
          {name}
        </h3>
        <p className="relative line-clamp-2 text-sm text-background">{tags}</p>
      </div>
      <div className="flex flex-col justify-between px-4 py-3">
        <div className="mb-3 flex items-center justify-start gap-5">
          <div className="m-0 flex h-[30px] w-[30px] items-center justify-center p-0">
            <Image
              src="/ru/images/icon-loop.png"
              alt={'Иконка'}
              width={25}
              height={25}
            />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-background">{title}</p>
            <p className="line-clamp-1 text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <p className="line-clamp-2 text-background">{description}</p>
      </div>
      <div className="mt-auto flex justify-end gap-5 px-4">
        <Button
          className="border-none bg-transparent p-0 hover:border-none hover:bg-transparent"
          variant="outline"
          onClick={() => setIsLiked(!isLiked)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={isLiked ? 'white' : 'none'}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.62 20.8096C12.28 20.9296 11.72 20.9296 11.38 20.8096C8.48 19.8196 2 15.6896 2 8.68961C2 5.59961 4.49 3.09961 7.56 3.09961C9.38 3.09961 10.99 3.97961 12 5.33961C13.01 3.97961 14.63 3.09961 16.44 3.09961C19.51 3.09961 22 5.59961 22 8.68961C22 15.6896 15.52 19.8196 12.62 20.8096Z"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
        <CustomLink
          className={cn(
            'h-10 bg-primary-mainAccent px-4 py-2 text-base font-semibold text-primary-foreground hover:bg-primary-mainAccent/90',
            'inline-flex items-center justify-center whitespace-nowrap rounded-md ring-offset-background',
            'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          )}
          lang={lang}
          href={`/${type}/${id}`}
        >
          Подробнее
        </CustomLink>
      </div>
    </li>
  );
}
