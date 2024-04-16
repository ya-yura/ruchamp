'use client';

import { Dispatch, SetStateAction, useRef, useState } from 'react';
import {
  Button,
  Combobox,
  makeStyles,
  Option,
  shorthands,
  tokens,
  useId,
} from '@fluentui/react-components';
import type { ComboboxProps } from '@fluentui/react-components';
import { Dismiss12Regular } from '@fluentui/react-icons';
import { TypeAthleteFields, TypeRegisterFields } from '@/lib/definitions';

type TypeMultiSelectWithTagsProps = {
  multiselectId: keyof TypeAthleteFields;
  label: string;
  placeholder: string;
  options: string[];
  setValues?: Dispatch<SetStateAction<TypeRegisterFields>>;
} & Partial<ComboboxProps>;

const useStyles = makeStyles({
  root: {
    // Stack the label above the field with a gap
    display: 'grid',
    gridTemplateRows: 'repeat(1fr)',
    justifyItems: 'start',
    ...shorthands.gap('2px'),
    maxWidth: '400px',
    width: '100%',
    '& div': {
      width: '100%',
    },
  },
  tagsList: {
    listStyleType: 'none',
    marginBottom: tokens.spacingVerticalXXS,
    marginTop: 0,
    paddingLeft: 0,
    display: 'flex',
    gridGap: tokens.spacingHorizontalXXS,
  },
});

export const MultiselectWithTags = ({
  multiselectId,
  label,
  placeholder,
  options,
  setValues,
  ...props
}: TypeMultiSelectWithTagsProps) => {
  // generate ids for handling labelling
  const comboId = useId('combo-multi');
  const selectedListId = `${comboId}-selection`;

  // refs for managing focus when removing tags
  const selectedListRef = useRef<HTMLUListElement>(null);
  const comboboxInputRef = useRef<HTMLInputElement>(null);

  const styles = useStyles();

  // Handle selectedOptions both when an option is selected or deselected in the Combobox,
  // and when an option is removed by clicking on a tag
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const onSelect: ComboboxProps['onOptionSelect'] = (event, data) => {
    setSelectedOptions(data.selectedOptions);
    if (setValues) {
      setValues((prevValues) => ({
        ...prevValues,
        [multiselectId]: data.selectedOptions,
      }));
    }
  };

  const onTagClick = (option: string, index: number) => {
    // remove selected option
    setSelectedOptions(selectedOptions.filter((o) => o !== option));
    if (setValues) {
      setValues((prevValues) => ({
        ...prevValues,
        [multiselectId]: (prevValues[multiselectId] as string[]).filter(
          (o) => o !== option,
        ),
      }));
    }
    // focus previous or next option, defaulting to focusing back to the combo input
    const indexToFocus = index === 0 ? 1 : index - 1;
    const optionToFocus = selectedListRef.current?.querySelector(
      `#${comboId}-remove-${indexToFocus}`,
    );
    if (optionToFocus) {
      (optionToFocus as HTMLButtonElement).focus();
    } else {
      comboboxInputRef.current?.focus();
    }
  };

  const labelledBy =
    selectedOptions.length > 0 ? `${comboId} ${selectedListId}` : comboId;

  return (
    <div className={styles.root}>
      <label id={comboId}>
        {label} <span className="text-red-500">*</span>{' '}
      </label>
      {selectedOptions.length ? (
        <ul
          id={selectedListId}
          className={styles.tagsList}
          ref={selectedListRef}
        >
          {selectedOptions.map((option, i) => (
            <li key={option}>
              <Button
                size="small"
                shape="circular"
                appearance="primary"
                icon={<Dismiss12Regular />}
                iconPosition="after"
                onClick={() => onTagClick(option, i)}
                id={`${comboId}-remove-${i}`}
                aria-labelledby={`${comboId}-remove ${comboId}-remove-${i}`}
              >
                {option}
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
      <Combobox
        aria-labelledby={labelledBy}
        multiselect={true}
        placeholder={placeholder}
        selectedOptions={selectedOptions}
        onOptionSelect={onSelect}
        ref={comboboxInputRef}
        size="large"
        {...props}
      >
        {options.map((option) => (
          <Option key={option}>{option}</Option>
        ))}
      </Combobox>
    </div>
  );
};
