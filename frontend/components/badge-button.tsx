import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SportsTypes } from '@/lib/constants';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

type TypeBadgeButtonProps = {
  title: SportsTypes;
  isDisabled?: boolean;
  selected?: SportsTypes[];
  setSelected?: Dispatch<SetStateAction<SportsTypes[]>>;
};

export function BadgeButton({
  title,
  isDisabled,
  selected,
  setSelected,
}: TypeBadgeButtonProps) {
  const [isSelected, setIsSelected] = useState<boolean>(false);

  useEffect(() => {
    setIsSelected(selected?.some((item) => item === title) || false);
  }, [selected]);

  function selectBadge(): void {
    if (isDisabled) return;
    // setIsSelected(!isSelected);
    if (setSelected) {
      setSelected((prevState) => {
        if (prevState.includes(title)) {
          return prevState.filter((item) => item !== title);
        } else {
          return [...prevState, title];
        }
      });
    }
  }

  return (
    <Button
      variant="outline"
      className="w-fit border-none bg-transparent p-0 hover:border-none hover:bg-transparent"
      aria-label={title}
      onClick={selectBadge}
    >
      <Badge variant={isSelected ? 'ruchampSelected' : 'ruchampDefault'}>
        {title}
      </Badge>
    </Button>
  );
}
