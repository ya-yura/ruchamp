import { Button } from '@/components/ui/button';
import { Locale } from '@/i18n.config';
import React from 'react';

interface ProfileActionButtonsProps {
  token?: string;
  isOwner?: boolean;
  lang: Locale;
}

export function ProfileActionButtons({
  token,
  isOwner,
  lang,
}: ProfileActionButtonsProps) {
  return (
    <div className="mb-[87px] flex gap-6">
      <Button variant="ruchampDefault">Создать команду</Button>
      <Button variant="ruchampTransparent">Обновить фото</Button>
      <Button className='ml-auto' variant="ruchampTransparent">Изменить пароль</Button>
    </div>
  );
}
