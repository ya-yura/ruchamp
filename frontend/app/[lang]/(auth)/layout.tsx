import { redirect } from 'next/navigation';
import Image from 'next/image';
import { getSession } from '@/lib/actions';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (session) {
    redirect('/ru/events');
  }

  return (
    <main className="absolute left-0 top-0 h-[100vh] w-full bg-[#0A0A0A]">
      <Image
        className="relative opacity-50"
        src="/ru/images/background-auth.jpeg"
        alt={'ДОБАВИТЬ ОПИСАНИЕ'}
        fill={true}
        style={{ objectFit: 'cover' }}
      />
      {children}
    </main>
  );
}
