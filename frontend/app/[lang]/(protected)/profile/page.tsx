import Image from 'next/image';
import { Container } from '../../ui/container';
import { UserForm } from './user-form';
import { UserFormAthlete } from './user-form-athlete';
import { UserFormOrganizer } from './user-form-organizer';
import { EnumUserRole } from '@/lib/definitions';
import { UserFormSpectator } from './user-form-spectator';
import { UserFormSysadmin } from './user-form-sysadmin';
import { UserFormReferee } from './user-form-referee';
import { getSession } from '@/lib/actions';

export default async function Profile() {
  const session = await getSession();
  const userCommonData =
    session &&
    session.user.find((item: object) => Object.keys(item).includes('User'))[
      'User'
    ];
  const userSpecialData = () => {
    switch (userCommonData.role_id) {
      case 1:
        return (
          session &&
          session.user.find((item: object) =>
            Object.keys(item).includes('Athlete'),
          )?.['Athlete']
        );
      case 2:
        return (
          session &&
          session.user.find((item: object) =>
            Object.keys(item).includes('EventOrganizer'),
          )?.['EventOrganizer']
        );
      case 3:
        return (
          session &&
          session.user.find((item: object) =>
            Object.keys(item).includes('Spectator'),
          )?.['Spectator']
        );
      case 4:
        return (
          session &&
          session.user.find((item: object) =>
            Object.keys(item).includes('Sysadmin'),
          )?.['Sysadmin']
        );
      case 5:
        return (
          session &&
          session.user.find((item: object) =>
            Object.keys(item).includes('Referee'),
          )?.['Referee']
        );
    }
  };

  return (
    <Container className="min-h-fit">
      <section className="relative mt-[-92px] flex h-[800px] w-full items-start justify-center gap-10 bg-[#0A0A0A] px-[72px] pt-[92px]">
        <Image
          className="opacity-50"
          src="/ru/images/event-hero-bg.jpeg"
          alt={'ДОБАВИТЬ ОПИСАНИЕ'}
          fill={true}
          style={{ objectFit: 'cover' }}
        />
        <UserForm user={userCommonData} />
        {userCommonData?.role_id === EnumUserRole['athlete'] && (
          <UserFormAthlete athlete={userSpecialData()} />
        )}
        {userCommonData?.role_id === EnumUserRole['organizer'] && (
          <UserFormOrganizer organizer={userSpecialData()} />
        )}
        {userCommonData?.role_id === EnumUserRole['spectator'] && (
          <UserFormSpectator spectator={userSpecialData()} />
        )}
        {userCommonData?.role_id === EnumUserRole['admin'] && (
          <UserFormSysadmin sysadmin={userSpecialData()} />
        )}
        {userCommonData?.role_id === EnumUserRole['referee'] && (
          <UserFormReferee referee={userSpecialData()} />
        )}
      </section>
    </Container>
  );
}
