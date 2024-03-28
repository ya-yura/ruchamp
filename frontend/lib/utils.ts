import { FieldProps } from '@fluentui/react-components';
import { TypeRegisterFields } from './definitions';

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
    touched.repeatPassword &&
    (values.password || values.repeatPassword)
  ) {
    if (values.password === values.repeatPassword) {
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
