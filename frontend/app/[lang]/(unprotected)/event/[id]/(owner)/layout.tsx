import '@/app/[lang]/ui/global.css';
import { Locale } from '@/i18n.config';
import { getSession } from '@/lib/actions/auth';
import { fetchEvent, fetchEvents } from '@/lib/data';
import { UserInfo } from '@/lib/definitions';
import { path } from '@/lib/utils/other-utils';
import { redirect } from 'next/navigation';

export default async function EventOwnerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string; lang: Locale };
}) {
  const { id, lang } = params;
  const [session, event, events] = await Promise.all([
    getSession(),
    fetchEvent(id),
    fetchEvents(),
  ]);
  const user: UserInfo | null = session
    ? {
        basicInfo: session.user[1],
        roleInfo: session.user[0],
      }
    : null;
  const isOwner = user?.roleInfo.id === event?.organizer_id;

  if (!isOwner) {
    redirect(path(params.lang, `/event/${id}/info`));
  }

  return <>{children}</>;
}
