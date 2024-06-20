import { ContentWraper } from '@/components/content-wraper';
import { CustomSection } from '@/components/custom-section';
import { Locale } from '@/i18n.config';
import { getSession } from '@/lib/actions/auth';
import { fetchEvent, fetchEventApplications } from '@/lib/data';
import { EventApplications } from './events-applications';

export default async function EventTeamsPage({
  params,
}: {
  params: { id: string; lang: Locale };
}) {
  const { id, lang } = params;
  const [session, event] = await Promise.all([getSession(), fetchEvent(id)]);
  const token = session?.token;
  const applications = await fetchEventApplications(token, id);

  return (
    <CustomSection className="relative bg-transparent">
      <ContentWraper className="items-start gap-6 pb-10">
        <EventApplications applications={applications} />
      </ContentWraper>
    </CustomSection>
  );
}
