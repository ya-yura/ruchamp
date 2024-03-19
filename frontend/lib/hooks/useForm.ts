import { useCallback, useState } from 'react';

export function useForm() {
  const [values, setValues] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isValid, setIsValid] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const name = target.name;
    const value = target.value;
    setValues({ ...values, [name]: value });
    setErrors({ ...errors, [name]: target.validationMessage });
    setIsValid(target.closest('form')!.checkValidity());

    // Подставляю свой текст ошибки при валидации имени, чтобы пользователь
    // понимал что не так
    // if (name === 'name') {
    //   if (target.validationMessage === 'Please match the requested format.') {
    //     setErrors({
    //       ...errors,
    //       name: 'Name must contain olny Latin or Cyrillic characters, spaces or symbol "-" and must not start with space',
    //     });
    //   }
    // }
  };

  const resetForm = useCallback(
    (newValues = {}, newErrors = {}, newIsValid = false) => {
      setValues(newValues);
      setErrors(newErrors);
      setIsValid(newIsValid);
    },
    [setValues, setErrors, setIsValid],
  );

  return { values, errors, isValid, handleChange, resetForm, setValues };
}
