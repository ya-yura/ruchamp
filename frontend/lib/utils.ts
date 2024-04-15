import { FieldProps } from '@fluentui/react-components';
import { TypeRegisterFields } from './definitions';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

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

export function formatDate(inputDate: string): string {
  const date = new Date(inputDate);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day} ${month} ${year}, ${hours}:${minutes}`;
}

export function transformDate(inputDate: string): string {
  const currentDate = new Date();
  const parsedDate = parseISO(inputDate);
  if (currentDate.getFullYear() === parsedDate.getFullYear()) {
    return format(parsedDate, 'dd MMMM', { locale: ru });
  } else {
    return format(parsedDate, 'dd MMMM yyyy', { locale: ru });
  }
}

export function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}
