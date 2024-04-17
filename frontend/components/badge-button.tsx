import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TypeSportsTypes } from '@/lib/constants';
import React, { Dispatch, SetStateAction, useState } from 'react';

type TypeBadgeButtonProps = {
  type: TypeSportsTypes;
  isDisabled?: boolean;
  setSelected?: Dispatch<SetStateAction<Array<TypeSportsTypes>>>;
};

export function BadgeButton({
  type,
  isDisabled,
  setSelected,
}: TypeBadgeButtonProps) {
  const [isSelected, setIsSelected] = useState<boolean>(false);

  function selectSportType(): void {
    if (isDisabled) return;
    setIsSelected(!isSelected);
    if (setSelected) {
      setSelected((prevState) => {
        if (prevState.includes(type)) {
          return prevState.filter((item) => item !== type);
        } else {
          return [...prevState, type];
        }
      });
    }
  }

  return (
    <Button
      variant="outline"
      className="w-fit border-none bg-transparent p-0 hover:border-none hover:bg-transparent"
      aria-label={type}
      onClick={selectSportType}
    >
      <Badge variant={isSelected ? 'ruchampSelected' : 'ruchampDefault'}>
        {type}
      </Badge>
    </Button>
  );
}