import { CreateTeamDialog } from '@/components/dialogs/create-team';
import { UpdateAthleteImageDialog } from '@/components/dialogs/update-profile-image';
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
      <UpdateAthleteImageDialog token={token} lang={lang} />
      <Button className="ml-auto" variant="ruchampTransparent">
        Изменить пароль
      </Button>
    </div>
  );
}
