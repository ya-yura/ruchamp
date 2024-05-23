import { Event } from './definitions';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, isPast, parseISO, differenceInYears, parse } from 'date-fns';
import { ru } from 'date-fns/locale';
import { sportTypes } from './constants';
import { DateRange } from 'react-day-picker';
import { Locale, i18n } from '@/i18n.config';

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

export function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

export function divideEventsByDateTime(events: Event[]): {
  futureEvents: Event[];
  pastEvents: Event[];
} {
  const futureEvents: Event[] = [];
  const pastEvents: Event[] = [];

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

export function isCurrentYear(date: Date): boolean {
  const currentDate = new Date();
  return currentDate.getFullYear() === date?.getFullYear();
}

export function isDateInRange(
  date: string,
  dateRange: DateRange | undefined,
): boolean {
  if (!dateRange) {
    return true;
  }
  const targetDate = new Date(date);
  if (isNaN(targetDate.getTime())) {
    return false;
  }
  const fromDate = dateRange.from;
  if (!fromDate) {
    return false;
  }
  let toDate = dateRange.to ? new Date(dateRange.to) : new Date(fromDate);
  toDate.setDate(toDate.getDate() + 1);

  return targetDate >= fromDate && targetDate < toDate;
}

export const path = (lang: Locale, href: string) => {
  const isDefaultLang = lang === i18n.defaultLocale;
  return isDefaultLang ? href : `/${lang}${href}`;
};

export function calculateGender(
  genders: boolean[],
): 'male' | 'female' | 'mixed' | '' {
  const maleCount = genders.filter((gender) => gender).length;
  const femaleCount = genders.length - maleCount;
  if (maleCount > 0 && femaleCount > 0) return 'mixed';
  if (maleCount > 0) return 'male';
  if (femaleCount > 0) return 'female';
  return '';
}

export function getRussianAgeWord(age: number): string {
  const lastDigit = age % 10;
  const lastTwoDigits = age % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return age + ' лет';
  } else if (lastDigit === 1) {
    return age + ' год';
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    return age + ' года';
  } else {
    return age + ' лет';
  }
}

export function calculateAge(birthDate: string): number {
  const today: Date = new Date();
  const dob: Date = parse(birthDate, 'yyyy-MM-dd', new Date());
  const age: number = differenceInYears(today, dob);
  return age;
}

export function getInitials(firstName: string, lastName: string): string {
  if (!firstName || !lastName) return '';
  const firstInitial = firstName.charAt(0);
  const lastInitial = lastName.charAt(0);
  return `${firstInitial}${lastInitial}`;
}

export function filterDuplicates<T extends Record<string, any>>(
  array: T[],
): T[] {
  const uniqueDataMap = new Map<string, T>();

  array.forEach((item) => {
    const key = JSON.stringify(item);
    if (!uniqueDataMap.has(key)) {
      uniqueDataMap.set(key, item);
    }
  });

  return Array.from(uniqueDataMap.values());
}

export function roundToBase(
  num: number,
  base: number,
  direction: 'up' | 'down' | 'nearest',
): number {
  switch (direction) {
    case 'up':
      return Math.ceil(num / base) * base;
    case 'down':
      return Math.floor(num / base) * base;
    case 'nearest':
    default:
      return Math.round(num / base) * base;
  }
}
