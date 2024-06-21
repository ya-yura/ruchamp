import {
  format,
  isPast,
  parseISO,
  differenceInYears,
  parse,
  isToday,
  isFuture,
  differenceInDays,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { Event } from '../definitions';
import { DateRange } from 'react-day-picker';

export function transformDate(
  inputDate: string | undefined | null,
  isWithTime?: boolean,
): string {
  if (!inputDate) return '';
  const currentDate = new Date();
  const parsedDate = parseISO(inputDate);
  const day = parsedDate.getDate(); // Get the day of the month without leading zero
  const monthYearFormat =
    currentDate.getFullYear() === parsedDate.getFullYear()
      ? 'MMMM'
      : 'MMMM yyyy' + ' г.';
  const timeFormat = isWithTime ? ', HH:mm' : '';
  const formattedDate = format(parsedDate, monthYearFormat + timeFormat, {
    locale: ru,
  });

  return `${day} ${formattedDate}`;
}

interface EventBase {
  start_datetime: string;
}

export function divideEventsByDateTime<T extends EventBase>(
  events: T[],
): {
  futureEvents: T[];
  pastEvents: T[];
} {
  const futureEvents: T[] = [];
  const pastEvents: T[] = [];

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

export function determineDateStatus(
  dateStr: string,
): 'past' | 'present' | 'future' {
  const date = parseISO(dateStr);

  if (isToday(date)) {
    return 'present';
  } else if (isPast(date)) {
    return 'past';
  } else if (isFuture(date)) {
    return 'future';
  }
  // In theory, we shouldn't reach this point because isPast and isFuture should cover all cases.
  throw new Error('Unexpected date comparison result');
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
  if (!birthDate) return 0;
  const today: Date = new Date();
  const dob: Date = parse(birthDate, 'yyyy-MM-dd', new Date());
  const age: number = differenceInYears(today, dob);
  return age;
}

function getRussianDayWord(days: number): string {
  if (days % 10 === 1 && days % 100 !== 11) {
    return 'день';
  } else if (
    [2, 3, 4].includes(days % 10) &&
    ![12, 13, 14].includes(days % 100)
  ) {
    return 'дня';
  } else {
    return 'дней';
  }
}

export function calculateDaysBefore(
  dateString: string | undefined,
  currentDate: Date,
): string {
  if (!dateString) return 'Данных нет';
  const date = parseISO(dateString);
  const daysDifference = differenceInDays(date, currentDate);

  const absoluteDaysDifference = Math.abs(daysDifference);
  const dayWord = getRussianDayWord(absoluteDaysDifference);

  if (daysDifference < 0) {
    return `${absoluteDaysDifference} ${dayWord} назад`;
  } else if (isToday(date)) {
    return 'Событие сегодня';
  } else {
    return `${absoluteDaysDifference} ${dayWord}`;
  }
}

export function getEventStatus(
  dateString: string | undefined,
  currentDate: Date,
): string {
  if (!dateString) return 'Данных нет';
  const date = parseISO(dateString);

  if (isToday(date)) {
    return '';
  } else if (date > currentDate) {
    return 'До начала осталось:';
  } else {
    return 'Событие прошло';
  }
}
