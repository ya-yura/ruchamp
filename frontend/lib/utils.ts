import { FieldProps } from '@fluentui/react-components';
import { TypeEvent, TypeRegisterFields } from './definitions';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { TypeSportsTypes, sportsTypes } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function comparePasswords(
  values: Partial<TypeRegisterFields>,
  touched: Record<string, boolean>,
  setPasswordState: React.Dispatch<
    React.SetStateAction<{
      state: FieldProps['validationState'];
      message: string;
    }>
  >,
): void {
  if (
    touched.password &&
    touched.repeat_password &&
    (values.password || values.repeat_password)
  ) {
    if (values.password === values.repeat_password) {
      setPasswordState({
        state: 'success',
        message: 'Пароли совпадают',
      });
    } else {
      setPasswordState({
        state: 'error',
        message: 'Пароли не совпадают',
      });
    }
  } else {
    setPasswordState({
      state: 'none',
      message: '',
    });
  }
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
