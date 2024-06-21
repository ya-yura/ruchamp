import { CreateTeamDialog } from '@/components/dialogs/create-team';
import { UpdateAthleteImageDialog } from '@/components/dialogs/update-athlete-image';
import { UpdateProfileDialog } from '@/components/dialogs/update-profile';
import { Locale } from '@/i18n.config';
import { UserInfo } from '@/lib/definitions';
import React from 'react';

interface ProfileActionButtonsProps {
  user: UserInfo;
  token?: string;
  lang: Locale;
}

export function ProfileActionButtons({
  user,
  token,
  lang,
}: ProfileActionButtonsProps) {
  return (
    <div className="mb-[87px] flex gap-6">
      <CreateTeamDialog token={token} lang={lang} />
      <UpdateAthleteImageDialog token={token} lang={lang} />
      <UpdateProfileDialog
        className="ml-auto"
        token={token}
        username={user.basicInfo.username}
        name={user.basicInfo.name}
        sirname={user.basicInfo.sirname}
        fathername={user.basicInfo.fathername}
        country={user.roleInfo.country}
        lang={lang}
      />
    </div>
  );
}
