'use client';

import * as React from 'react';
import { addDays, format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { ru } from 'date-fns/locale';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export function DatePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2024, 0, 20),
    to: addDays(new Date(2024, 0, 20), 20),
  });

  function isCurrentYear(date: Date): boolean {
    const currentDate = new Date();
    return currentDate.getFullYear() === date?.getFullYear();
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'ghost'}
            className={cn(
              'w-[500px] justify-center text-left text-[32px] font-bold text-[#616161] hover:bg-transparent hover:text-[#616161]/80',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(
                    date.from,
                    `dd LLL ${isCurrentYear(date.from) ? '' : 'y '}`,
                    {
                      locale: ru,
                    },
                  )}{' '}
                  —{' '}
                  {format(
                    date.to,
                    `dd LLL ${isCurrentYear(date.to) ? '' : 'y'}`,
                    {
                      locale: ru,
                    },
                  )}
                </>
              ) : (
                format(
                  date.from,
                  `dd LLL ${isCurrentYear(date.from) ? '' : 'y'}`,
                  {
                    locale: ru,
                  },
                )
              )
            ) : (
              <span>Выберите дату</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
