import Image from 'next/image';
import { Container } from '../../ui/container';
import { UserForm } from './user-form';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { auth } from '@/lib/api/auth';

export default async function Profile() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.name as string;
  const user = await auth.getCurrentUser(token);
  return (
    <Container className="min-h-fit">
      <section className="relative mt-[-92px] flex h-[720px] w-full flex-col items-center justify-between bg-[#0A0A0A] px-[72px] pt-[92px]">
        <Image
          className="opacity-50"
          src="/ru/images/event-hero-bg.jpeg"
          alt={'ДОБАВИТЬ ОПИСАНИЕ'}
          fill={true}
          style={{ objectFit: 'cover' }}
        />
        <UserForm user={user} />
      </section>
    </Container>
  );
}
