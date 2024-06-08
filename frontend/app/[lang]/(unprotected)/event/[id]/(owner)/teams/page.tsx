import { ContentWraper } from '@/components/content-wraper';
import { CustomSection } from '@/components/custom-section';
import { Locale } from '@/i18n.config';
import { getSession } from '@/lib/actions/auth';
import { fetchEvent } from '@/lib/data';
import { OwnerTeams } from './owner-teams';

export default async function EventTeamsPage({
  params,
}: {
  params: { id: string; lang: Locale };
}) {
  const { id, lang } = params;
  const [session, event] = await Promise.all([getSession(), fetchEvent(id)]);

  return (
    <CustomSection className="relative bg-transparent">
      <ContentWraper className="items-start gap-6 pb-10">
        <OwnerTeams />
      </ContentWraper>
    </CustomSection>
  );
}
