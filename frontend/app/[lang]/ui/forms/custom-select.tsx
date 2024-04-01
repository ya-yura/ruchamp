import { Field, Select, SelectOnChangeData } from '@fluentui/react-components';
import { ChangeEvent } from 'react';

type TypeCustomSelectProps = {
  label: string;
  defaultOption: string;
  id: string;
  name: string;
  onSelect: (
    ev: ChangeEvent<HTMLSelectElement>,
    data: SelectOnChangeData,
  ) => void;
  options: { [key: string]: string };
};

export function CustomSelect({
  label,
  defaultOption,
  id,
  name,
  onSelect,
  options,
}: TypeCustomSelectProps) {
  return (
    <Field as="div" size="medium" required label={label}>
      <Select id={id} name={name} onChange={onSelect} defaultValue="">
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
