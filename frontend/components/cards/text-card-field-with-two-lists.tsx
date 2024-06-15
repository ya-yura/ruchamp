import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react';
import { CustomSection } from '../custom-section';
import { ContentWraper } from '../content-wraper';

interface TextCardFieldWithTwoListsProps {
  firstList: ReactNode;
  secondList?: ReactNode;
  className?: string;
  ariaLabelledby?: string;
}

export function TextCardFieldWithTwoLists({
  firstList,
  secondList,
  className,
  ariaLabelledby = 'info',
}: TextCardFieldWithTwoListsProps) {
  return (
    <CustomSection className="relative mb-10">
      <ContentWraper>
        <div
          className={cn('grid min-h-44 w-full grid-cols-12 gap-4', className)}
          role="tabpanel"
          aria-labelledby={ariaLabelledby}
        >
          <ul className="order-2 col-span-12 flex flex-col gap-[18px] sm:order-1 sm:col-span-8">
            {firstList}
          </ul>
          <ul className="order-1 col-span-12 grid h-min gap-[18px] sm:order-2 sm:col-span-4 sm:grid-cols-1">
            {secondList}
          </ul>
        </div>
      </ContentWraper>
    </CustomSection>
  );
}
