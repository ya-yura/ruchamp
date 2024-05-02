import { TypeEvent } from './definitions';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, isPast, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { TypeSportsTypes, sportsTypes } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function transformDate(inputDate: string, isWithTime?: boolean): string {
  const currentDate = new Date();
  const parsedDate = parseISO(inputDate);
  if (currentDate.getFullYear() === parsedDate.getFullYear()) {
    return format(parsedDate, `dd MMMM${isWithTime ? ', HH:mm' : ''}`, {
      locale: ru,
    });
  } else {
    return format(parsedDate, `dd MMMM yyyy${isWithTime ? ', HH:mm' : ''}`, {
      locale: ru,
    });
  }
}

// Later it may be deleted
export function chooseTypes(event: TypeEvent | undefined): TypeSportsTypes[] {
  let res: TypeSportsTypes[] = [];
  const arr: string[] | undefined = event?.organizer_id.toString().split('');
  arr?.map((item) => res.push(sportsTypes[+item]));
  return [...new Set(res)];
}

export function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

export function divideEventsByDateTime(events: TypeEvent[]): {
  futureEvents: TypeEvent[];
  pastEvents: TypeEvent[];
} {
  const futureEvents: TypeEvent[] = [];
  const pastEvents: TypeEvent[] = [];

  events.forEach((event) => {
    const startDateTime = parseISO(event.start_datetime);
    if (isPast(startDateTime)) {
      pastEvents.push(event);
    } else {
      futureEvents.push(event);
    }
  });

  return { futureEvents, pastEvents };
}
