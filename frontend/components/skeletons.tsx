import React from 'react';
import { CustomSection } from './custom-section';
import { ContentWraper } from './content-wraper';
import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { TextCardFieldWithTwoLists } from './cards/text-card-field-with-two-lists';

export function EventsPageSkeleton() {
  return (
    <CustomSection className="relative mt-3 bg-transparent">
      <ContentWraper className="h-fit justify-between">
        <div className="relative mx-auto mb-10 w-full">
          <div className="flex h-[164px] w-full items-center sm:h-[64px]">
            <div className="mx-auto mb-5 flex h-auto w-fit flex-col justify-between gap-3 bg-transparent sm:flex-row lg:w-[500px]">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className={cn('h-3', `w-28`)}></Skeleton>
              ))}
            </div>
            <Skeleton className="absolute right-0 top-0 mt-2 h-6 w-28 rounded-full"></Skeleton>
          </div>
          <Skeleton className="mx-auto mt-4 h-6 w-[270px] rounded-full"></Skeleton>
          <div className="mt-6 flex max-w-5xl flex-wrap gap-[16px]">
            {Array.from({ length: 12 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-7 w-32 rounded-full"
              ></Skeleton>
            ))}
          </div>
        </div>
        {/* <Skeleton className="h-5 w-[120px] rounded-full"></Skeleton> */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 12 }).map((_, index) => (
            <Skeleton
              key={index}
              className="flex h-[450px] w-full flex-col rounded-xl pb-3"
            ></Skeleton>
          ))}
        </div>
      </ContentWraper>
    </CustomSection>
  );
}

export function TeamsPageSkeleton() {
  return (
    <CustomSection className="relative mt-3 bg-transparent">
      <ContentWraper className="h-fit justify-between">
        <div className="relative mx-auto mb-10 w-full">
          <div className="flex h-[164px] w-full items-center sm:h-[64px]">
            <div className="mx-auto mb-5 flex h-auto w-fit flex-col justify-between gap-3 bg-transparent sm:flex-row lg:w-[500px]">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className={cn('h-3', `w-28`)}></Skeleton>
              ))}
            </div>
            <Skeleton className="absolute right-0 top-0 mt-2 h-6 w-28 rounded-full"></Skeleton>
          </div>
          <Skeleton className="mx-auto mt-4 h-6 w-[270px] rounded-full"></Skeleton>
          <div className="mt-6 flex max-w-5xl flex-wrap gap-[16px]">
            {Array.from({ length: 12 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-7 w-32 rounded-full"
              ></Skeleton>
            ))}
          </div>
        </div>
        {/* <Skeleton className="h-5 w-[120px] rounded-full"></Skeleton> */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 12 }).map((_, index) => (
            <Skeleton
              key={index}
              className="flex h-[450px] w-full flex-col rounded-xl pb-3"
            ></Skeleton>
          ))}
        </div>
      </ContentWraper>
    </CustomSection>
  );
}

export function EventResultsSkeleton() {
  return (
    <CustomSection className="relative mb-10">
      <ContentWraper className="relative">
        <div
          className="relative flex w-full flex-col gap-6"
          aria-labelledby="skeleton"
        >
          <Skeleton className="mt-2 h-6 w-36 rounded-full"></Skeleton>
          <ul className="grid w-full grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-3">
            <li className="flex flex-col items-center gap-7">
              <Image
                src={`/images/medals/gold.svg`}
                alt=""
                width={213}
                height={241}
              />
              <Skeleton className="h-36 w-full rounded-lg" />
            </li>
            <li className="flex flex-col items-center gap-7">
              <Image
                src={`/images/medals/silver.svg`}
                alt=""
                width={213}
                height={241}
              />
              <Skeleton className="h-36 w-full rounded-lg" />
            </li>
            <li className="flex flex-col items-center gap-7">
              <Image
                src={`/images/medals/bronze.svg`}
                alt=""
                width={213}
                height={241}
              />
              <Skeleton className="h-36 w-full rounded-lg" />
            </li>
          </ul>
        </div>
      </ContentWraper>
    </CustomSection>
  );
}

export function EventParticipantsSkeleton() {
  return (
    <TextCardFieldWithTwoLists
      firstList={Array.from({ length: 30 }).map((_, index) => (
        <Skeleton key={index} className="h-[92px] w-full rounded-lg"></Skeleton>
      ))}
      secondList={<Skeleton className="h-96 w-full" />}
    />
  );
}
