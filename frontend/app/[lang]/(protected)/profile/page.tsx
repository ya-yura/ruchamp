import Image from 'next/image';
import { Container } from '../../ui/container';
import { UserForm } from './user-form';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { auth } from '@/lib/api/auth';
import { UserFormAthlete } from './user-form-athlete';
import { UserFormOrganizer } from './user-form-organizer';
import { EnumUserRole } from '@/lib/definitions';
import { UserFormSpectator } from './user-form-spectator';
import { UserFormSysadmin } from './user-form-sysadmin';
import { UserFormReferee } from './user-form-referee';

export default async function Profile() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.name as string;
  const user = await auth.getCurrentUser(token);
  let athlete = null;
  const organizer = {
    organization_name: 'Организация организатора',
    website: 'https://...',
    contact_email: '123@123.com',
    contact_phone: '123',
    description: 'Описание',
    image_field:
      'https://images.unsplash.com/photo-1711950901044-fa6215a9c59b?q=80&w=3570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  };
  const spectator = {
    phone_number: '+7-900-555-11-33',
    image_field:
      'https://images.unsplash.com/photo-1711950901044-fa6215a9c59b?q=80&w=3570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  };
  const sysadmin = {
    phone_number: '+7-900-555-11-22',
    image_field:
      'https://images.unsplash.com/photo-1711950901044-fa6215a9c59b?q=80&w=3570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  };
  const referee = {
    qualification_level: 'Первая категория',
    image_field:
      'https://images.unsplash.com/photo-1711950901044-fa6215a9c59b?q=80&w=3570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  };

  if (user.role_id === EnumUserRole['athlete']) {
    athlete = await auth.getAthlete(token);
  }

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
        <UserForm user={user} />
        {true &&  <UserFormSysadmin sysadmin={sysadmin} />}
        {user.role_id === EnumUserRole['athlete'] && (
          <UserFormAthlete athlete={athlete} />
        )}
        {user.role_id === EnumUserRole['organizer'] && (
          <UserFormOrganizer organizer={organizer} />
        )}
        {user.role_id === EnumUserRole['spectator'] && (
          <UserFormSpectator spectator={spectator} />
        )}
        {user.role_id === EnumUserRole['admin'] && (
          <UserFormSysadmin sysadmin={sysadmin} />
        )}
        {user.role_id === EnumUserRole['referee'] && (
          <UserFormReferee referee={referee} />
        )}
      </section>
    </Container>
  );
}
