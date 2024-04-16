'use client';

import type {
  ButtonProps,
  FieldProps,
  InputProps,
} from '@fluentui/react-components';
import { Button, Field, Input } from '@fluentui/react-components';
import { makeStyles, mergeClasses } from '@fluentui/react-components';
import { EyeOffRegular } from '@fluentui/react-icons';
import { useState } from 'react';

type TypeInputFieldProps = {
  fieldProps?: Partial<FieldProps>;
  inputProps?: Partial<InputProps>;
} & React.HTMLAttributes<HTMLDivElement>;

type TypeEyeOffButtonProps = {
  setIsShown: (isShown: boolean) => void;
  isShown: boolean;
} & ButtonProps;

const useOverrides = makeStyles({
  label: {
    width: '100%',
    '& label': {
      fontWeight: '400',
      fontSize: '14px',
    },
  },
});

export function InputField({
  fieldProps,
  inputProps,
  className,
}: TypeInputFieldProps) {
  const [isShownPassword, setIsShownPassword] = useState<boolean>(false);
  const overrides = useOverrides();

  return (
    <Field
      {...fieldProps}
      as="div"
      className={mergeClasses(overrides.label, className)}
      size="large"
      required
    >
      {inputProps?.type === 'password' ? (
        <Input
          {...inputProps}
          as="input"
          type={isShownPassword ? 'text' : 'password'}
          contentAfter={
            <EyeOffButton
              aria-label="Show and hide password"
              isShown={isShownPassword}
              setIsShown={setIsShownPassword}
            />
          }
        />
      ) : (
        <Input {...inputProps} as="input" />
      )}
    </Field>
  );
}

function EyeOffButton({
  setIsShown,
  isShown,
  ...props
}: TypeEyeOffButtonProps) {
  return (
    <Button
      {...props}
      appearance="transparent"
      icon={<EyeOffRegular />}
      size="small"
      onClick={() => setIsShown(!isShown)}
    />
  );
}
