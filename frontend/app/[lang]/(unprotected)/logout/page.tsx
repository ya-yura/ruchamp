import { Locale } from '@/i18n.config';
import { LogoutButtons } from './buttons';
import { path } from '@/lib/utils';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/actions/auth';

export default async function LogoutPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const session = await getSession();
  let token;
  if (!session) {
    token = null;
  } else token = session.token;

  if (!session) {
    redirect(path(lang, '/'));
  }

  return (
    <div className="relative flex h-[100vh] w-full flex-col items-center justify-center gap-12">
      <h1 className="text-white">Уверены, что хотите выйти?</h1>
      <LogoutButtons token={token} />
    </div>
  );
}
