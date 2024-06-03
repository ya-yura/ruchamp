import React from 'react';
import { CustomSection } from './custom-section';
import { ContentWraper } from './content-wraper';
import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';

export function EventsPageSkeleton() {
  return (
    <CustomSection className="relative bg-transparent mt-3">
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
            {Array.from({ length: 30 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-7 w-32 rounded-full"
              ></Skeleton>
            ))}
          </div>
        </div>
        <Skeleton className="h-5 w-[120px] rounded-full"></Skeleton>
        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
