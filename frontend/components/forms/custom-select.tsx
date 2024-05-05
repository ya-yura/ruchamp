import {
  Field,
  FieldProps,
  Select,
  SelectOnChangeData,
  SelectProps,
} from '@fluentui/react-components';
import { ChangeEvent } from 'react';

type TypeCustomSelectProps = {
  label: string;
  defaultOption: string;
  id: string;
  name?: string;
  onSelect?: (
    ev: ChangeEvent<HTMLSelectElement>,
    data: SelectOnChangeData,
  ) => void;
  options: { [key: string]: string };
  fieldProps?: Partial<FieldProps>;
  selectProps?: Partial<SelectProps>;
};

export function CustomSelect({
  label,
  defaultOption,
  id,
  onSelect,
  options,
  fieldProps,
  selectProps,
}: TypeCustomSelectProps) {
  return (
    <Field {...fieldProps} as="div" size="medium" required label={label}>
      <Select
        {...selectProps}
        id={id}
        name={id}
        onChange={onSelect}
        size="large"
        defaultValue=""
      >
        <option value="" disabled>
          {defaultOption}
        </option>
        {Object.entries(options).map(([key, value]) => (
          <option key={key} value={key}>
            {value}
          </option>
        ))}
      </Select>
    </Field>
  );
}
