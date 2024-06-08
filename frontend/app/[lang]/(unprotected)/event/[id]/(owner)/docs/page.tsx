import { ContentWraper } from '@/components/content-wraper';
import { CustomSection } from '@/components/custom-section';
import { Locale } from '@/i18n.config';
import { getSession } from '@/lib/actions/auth';
import { fetchEvent } from '@/lib/data';
import { OwnerDocs } from './owner-docs';

export default async function EventDocsPage({
  params,
}: {
  params: { id: string; lang: Locale };
}) {
  const { id, lang } = params;
  const [session, event] = await Promise.all([getSession(), fetchEvent(id)]);

  return (
    <CustomSection className="relative bg-transparent">
      <ContentWraper className="items-start gap-6 pb-10">
        <OwnerDocs />
      </ContentWraper>
    </CustomSection>
  );
}
