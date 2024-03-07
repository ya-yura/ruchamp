import type { FieldProps } from '@fluentui/react-components';
import { Field, Input } from '@fluentui/react-components';

export const InputField = (props: Partial<FieldProps>) => (
  <Field {...props}>
    <Input as="input" placeholder={`${props.label}`} />
  </Field>
);
