'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu';
import { FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form';
import { TypeField } from './custom-fieldset';

type Checked = DropdownMenuCheckboxItemProps['checked'];

type DropdownMenuCheckboxesProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  item: TypeField<T>;
  placeholder: string;
  // checkedItems: string[];
  // setCheckedItems: React.Dispatch<React.SetStateAction<string[]>>;
};

export function DropdownMenuCheckboxes<T extends FieldValues>({
  item,
  placeholder,
  form,
  // checkedItems,
  // setCheckedItems,
}: DropdownMenuCheckboxesProps<T>) {
  const [checkedItems, setCheckedItems] = React.useState<string[]>([]);

  React.useEffect(() => {
    form.setValue(item.name, checkedItems as PathValue<T, Path<T>>);
  }, [checkedItems]);

  const handleCheckedChange = (label: string) => (checked: Checked) => {
    setCheckedItems((prev) => {
      let newCheckedItems;
      if (checked) {
        newCheckedItems = [...prev, label];
      } else {
        newCheckedItems = prev.filter((item) => item !== label);
      }
      return newCheckedItems;
    });
  };

  return (
    <DropdownMenu>
      {checkedItems && (
        <div className="flex flex-wrap gap-1">
          {checkedItems.map((item) => (
            <Badge
              className="bg-primary-mainAccent"
              key={item}
              onClick={() =>
                handleCheckedChange(item)(!checkedItems.includes(item))
              }
            >
              {item}
            </Badge>
          ))}
        </div>
      )}
      <DropdownMenuTrigger asChild>
        <Button
          className="justify-start focus-visible:ring-1 focus-visible:ring-ring/20 focus-visible:ring-offset-1"
          variant="outline"
        >
          {placeholder}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <ScrollArea className="h-72 w-60">
          {item.multiselectOptions?.map((item: PathValue<T, Path<T>>) => (
            <DropdownMenuCheckboxItem
              key={item}
              checked={checkedItems.includes(item)}
              onCheckedChange={handleCheckedChange(item)}
            >
              {item}
            </DropdownMenuCheckboxItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
