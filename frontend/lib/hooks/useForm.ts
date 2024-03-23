import { useCallback, useState } from 'react';

export function useForm() {
  const [values, setValues] = useState<{
    [key: string]: string | number | Date | boolean;
    // [key: string]: string;
  }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isValid, setIsValid] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const name = target.name;
    const value = target.value;
    setValues({ ...values, [name]: value });
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: target.validationMessage });
    setIsValid(target.closest('form')!.checkValidity());
  };

  const resetForm = useCallback(
    (newValues = {}, newErrors = {}, newIsValid = false) => {
      setValues(newValues);
      setErrors(newErrors);
      setIsValid(newIsValid);
    },
    [setValues, setErrors, setIsValid],
  );

  return { values, touched, errors, isValid, handleChange, resetForm, setValues, setTouched };
}
