import { Locale, i18n } from '@/i18n.config';
import { Event } from '../definitions';
import { ValueOption } from '@/app/[lang]/(unprotected)/team/[id]/page';

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

export function filterUniqueDisplayedValues(
  data: ValueOption[],
): ValueOption[] {
  const seenDisplayedValues = new Set<string>();
  return data.filter((item) => {
    if (seenDisplayedValues.has(item.displayedValue)) {
      return false;
    } else {
      seenDisplayedValues.add(item.displayedValue);
      return true;
    }
  });
}

export function checkResponse(res: any) {
  return res.ok ? res.json() : Promise.reject(res.status);
}

export function getExpectedEvents(
  events: Event[] | null,
  randomInt: number,
  maxEvents: number,
): Event[] {
  if (events === null) return [];
  if (events.length > 3) {
    return events.slice(randomInt, randomInt + maxEvents);
  }
  return events.length > 0 ? events.slice(0, events.length) : [];
}
