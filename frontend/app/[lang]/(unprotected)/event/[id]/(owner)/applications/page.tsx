import { cn } from '@/lib/utils';
import { ContentWraper } from '@/components/content-wraper';
import { CustomSection } from '@/components/custom-section';
import { Locale } from '@/i18n.config';
import { getSession } from '@/lib/actions/auth';
import { fetchEvent, fetchEventApplications } from '@/lib/data';
import { EventApplications } from './events-applications';
import { INFO } from './const';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default async function EventApplicationsPage({
  params,
}: {
  params: { id: string; lang: Locale };
}) {
  // const { id, lang } = params;
  const id = '175';
  const [session, event] = await Promise.all([getSession(), fetchEvent(id)]);
  const token = session?.token;
  const applications = await fetchEventApplications(token, id);

  const paid = applications?.paid;
  const approved = applications?.approved;
  const accepted = applications?.accepted;

  const tabsData: Record<string, string> = {
    approved: 'Одобренные',
    rejected: 'Отклонённые',
    accepted: 'Новые в ожидании',
    paid: 'Оплаченные',
  };



  return (
    <CustomSection className="relative bg-transparent">
      <ContentWraper className="items-start pb-10">
        <EventApplications applications={applications} paid={paid} accepted={accepted} approved={approved} tabsData={tabsData} />
      </ContentWraper>
    </CustomSection>
  );
}
