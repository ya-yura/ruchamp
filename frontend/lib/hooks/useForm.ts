import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import {
  TypeBasicUserFields,
  TypeRegisterFields,
  TypeUserRole,
} from '../definitions';
import {
  RadioGroupOnChangeData,
  SelectOnChangeData,
} from '@fluentui/react-components';

type TypeValues = TypeRegisterFields; // add more types here

export function useForm() {
  const [values, setValues] = useState<TypeValues>({} as TypeValues);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isValid, setIsValid] = useState<boolean>(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const target = event.target as HTMLInputElement;
    const name = target.name;
    const value = target.value;
    setValues({ ...values, [name]: value });
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: target.validationMessage });
    setIsValid(target.closest('form')!.checkValidity());
  }

  function handleRadioChange(
    ev: FormEvent<HTMLDivElement>,
    data: RadioGroupOnChangeData,
  ): void {
    const target = ev.target as HTMLInputElement;
    const name = target.name as keyof TypeRegisterFields;
    if (name === 'role_id') {
      setValues((prevValues) => ({
        ...prevValues,
        [name]: +data.value as TypeUserRole,
      }));
    }
    if (name === 'gender') {
      setValues((prevValues) => ({
        ...prevValues,
        [name]: (data.value === 'male'
          ? true
          : false) as TypeBasicUserFields['gender'],
      }));
    }
  }

  function handleSelectChange(
    ev: ChangeEvent<HTMLSelectElement>,
    data: SelectOnChangeData,
  ): void {
    const qualificaion = parseInt(data.value);
    if (!isNaN(qualificaion)) {
      setValues((prevValues) => ({
        ...prevValues,
        referee_qualification_level: qualificaion,
      }));
    }
  }

  const resetForm = useCallback(
    (newValues = {}, newErrors = {}, newIsValid = false) => {
      setValues(newValues as TypeValues);
      setErrors(newErrors);
      setIsValid(newIsValid);
    },
    [setValues, setErrors, setIsValid],
  );

  return {
    values,
    touched,
    errors,
    isValid,
    handleChange,
    handleRadioChange,
    handleSelectChange,
    resetForm,
    setValues,
    setTouched,
  };
}
