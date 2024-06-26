'use client';

import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PhoneInput } from '../ui/phone-input';
import { FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form';
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemWithIcon,
} from '../ui/radio-group';
import { DropdownMenuCheckboxes } from './custom-multiselect';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

type TypeOptionWithIcon = {
  value: string;
  option: string;
  icon?: string;
};

export type TypeField<T> = {
  type:
    | 'text'
    | 'password'
    | 'tel'
    | 'number'
    | 'email'
    | 'date'
    | 'checkbox'
    | 'radio'
    | 'customradio'
    | 'select'
    | 'multiselect';
  name: Path<T>;
  placeholder?: string;
  label?: string;
  defaultValue?: string;
  orientation?: 'row' | 'col';
  selectOptions?: TypeOptionWithIcon[];
  multiselectOptions?: PathValue<T, Path<T>>;
  radioOptions?: { [s: string]: string } | ArrayLike<string>;
  customRadioOptions?: TypeOptionWithIcon[];
};

export type TypeFieldsetData<T> = {
  title?: string;
  description?: string;
  fields: TypeField<T>[];
};

type TypeCustomFildsetProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  fieldsetData: TypeFieldsetData<T>;
  errorMessage?: string;
} & React.HTMLAttributes<HTMLFormElement>;

export function CustomFieldset<T extends FieldValues>({
  fieldsetData,
  form,
  errorMessage,
  className,
}: TypeCustomFildsetProps<T>) {
  return (
    <fieldset className={cn(`grid w-full grid-cols-12 gap-5`, className)}>
      {fieldsetData.fields.map((item) => (
        <FormField
          key={item.name}
          control={form.control}
          name={item.name}
          render={({ field }) => (
            <FormItem className={`relative col-span-12 flex flex-col`}>
              {item.label && <FormLabel>{item.label}</FormLabel>}
              {['text', 'email', 'date', 'number'].includes(item.type) && (
                <>
                  <FormControl>
                    <Input
                      placeholder={item.placeholder}
                      type={item.type}
                      {...field}
                    />
                  </FormControl>
                </>
              )}
              {item.type === 'password' && (
                <>
                  <FormControl>
                    <Input
                      placeholder={item.placeholder}
                      type={item.type}
                      {...field}
                    />
                  </FormControl>
                </>
              )}
              {item.type === 'tel' && (
                <>
                  <FormControl>
                    <PhoneInput
                      defaultCountry="RU"
                      placeholder={item.placeholder}
                      {...field}
                    />
                  </FormControl>
                </>
              )}
              {item.type === 'select' && item.selectOptions && (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={item.placeholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {item.selectOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex gap-2">
                          {option.icon && (
                            <div className="relative h-[22px] w-[24px]">
                              <Image
                                className="relative"
                                src={option.icon}
                                alt={option.value}
                                fill={true}
                                style={{
                                  objectFit: 'contain',
                                }}
                              />
                            </div>
                          )}

                          <p>{option.option}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {item.type === 'multiselect' && item.multiselectOptions && (
                <DropdownMenuCheckboxes<T>
                  form={form}
                  item={item}
                  placeholder={item.placeholder || ''}
                />
              )}
              {item.type === 'radio' && item.radioOptions && (
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className={`flex flex-${item.orientation}`}
                >
                  {Object.entries(item.radioOptions).map(([key, value]) => (
                    <FormItem
                      key={key}
                      className="flex items-center space-x-3 space-y-0"
                    >
                      <FormControl>
                        <RadioGroupItem value={key} />
                      </FormControl>
                      <FormLabel className="font-normal">{value}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              )}
              {item.type === 'customradio' && item.customRadioOptions && (
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className={`flex flex-col sm:flex-${item.orientation} mx-auto justify-between`}
                >
                  {item.customRadioOptions.map((option) => (
                    <FormItem key={option.value} className="flex items-center">
                      <FormControl>
                        <RadioGroupItemWithIcon
                          className="flex flex-row items-center gap-4 sm:flex-col"
                          value={option.value}
                        >
                          {option.icon && (
                            <>
                              <div className="relative h-[66px] w-[63px]">
                                <Image
                                  className="relative"
                                  src={option.icon}
                                  alt={option.option}
                                  fill={true}
                                  style={{ objectFit: 'contain' }}
                                />
                              </div>
                              <p className="group rounded-full bg-foreground px-2 py-1 font-semibold">
                                {option.option}
                              </p>
                            </>
                          )}
                        </RadioGroupItemWithIcon>
                      </FormControl>
                    </FormItem>
                  ))}
                </RadioGroup>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
      {errorMessage && (
        <p className="col-span-12 flex items-center gap-2">
          <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
          <span className="text-red-400">{errorMessage}</span>
        </p>
      )}
    </fieldset>
  );
}
