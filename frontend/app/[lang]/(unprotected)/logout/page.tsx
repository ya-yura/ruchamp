import { LogoutButtons } from './buttons';
import { getSession } from '@/lib/actions';
import { redirect } from 'next/navigation';

export default async function LogoutPage() {
  const session = await getSession();
  let token;
  if (!session) {
    token = null;
  } else token = session.token;

  if (!session) {
    redirect('/ru');
  }

  return (
    <div className="relative flex h-[100vh] w-full flex-col items-center justify-center gap-12">
      <h1 className='text-white'>Уверены, что хотите выйти?</h1>
      <LogoutButtons token={token} />
    </div>
  );
}
