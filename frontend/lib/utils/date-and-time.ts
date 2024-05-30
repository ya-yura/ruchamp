import { format, isPast, parseISO, differenceInYears, parse } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Event } from '../definitions';
import { DateRange } from 'react-day-picker';

export function transformDate(inputDate: string, isWithTime?: boolean): string {
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
