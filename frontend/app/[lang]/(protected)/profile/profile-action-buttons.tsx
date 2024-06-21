import { CreateTeamDialog } from '@/components/dialogs/create-team';
import { Button } from '@/components/ui/button';
import { Locale } from '@/i18n.config';
import React from 'react';

interface ProfileActionButtonsProps {
  token?: string;
  lang: Locale;
}

export function ProfileActionButtons({
  token,
  lang,
}: ProfileActionButtonsProps) {
  return (
    <div className="mb-[87px] flex gap-6">
      <CreateTeamDialog token={token} lang={lang} />
      <Button variant="ruchampTransparent">Обновить фото</Button>
      <Button className="ml-auto" variant="ruchampTransparent">
        Изменить пароль
      </Button>
    </div>
  );
}
