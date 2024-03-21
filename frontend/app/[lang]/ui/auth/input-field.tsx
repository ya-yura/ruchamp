import type { FieldProps, InputProps } from '@fluentui/react-components';
import { Field, Input } from '@fluentui/react-components';

export const InputField = ({
  fieldProps,
  inputProps,
}: {
  fieldProps?: Partial<FieldProps>;
  inputProps?: Partial<InputProps>;
}) => (
  <Field {...fieldProps} as="div" size="large" required>
    <Input {...inputProps} as="input" />
  </Field>
);
