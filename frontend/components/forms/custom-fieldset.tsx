import { InputField } from '../auth/input-field';
import { TypeCustomFieldsetProps, TypeRegisterFields } from '@/lib/definitions';

export function CustomFieldset({
  isLoading = false,
  fields,
  onChange,
  onBlur,
  values,
  errors,
  passwordState,
}: TypeCustomFieldsetProps) {
  return (
    <fieldset
      className="relative mb-6 flex h-auto w-[400px] flex-col items-center justify-start gap-4"
      disabled={isLoading}
    >
      {fields.map((item, index) => {
        const { label, type, placeholder, name } = item;
        return (
          <InputField
            key={index}
            fieldProps={{
              label,
              validationMessage: name?.includes('password')
                ? passwordState?.message
                : errors
                  ? errors[`${name}`]
                  : undefined,
              validationState: name?.includes('password')
                ? passwordState?.state
                : errors && errors[`${name}`]
                  ? 'error'
                  : 'none',
            }}
            inputProps={{
              type,
              placeholder,
              onChange: onChange,
              onBlur: onBlur,
              value: (values[name as keyof TypeRegisterFields] as string) || '',
              name,
            }}
          />
        );
      })}
    </fieldset>
  );
}
