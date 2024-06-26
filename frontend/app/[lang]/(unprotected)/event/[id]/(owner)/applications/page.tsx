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

export default async function EventTeamsPage({
  params,
}: {
  params: { id: string; lang: Locale };
}) {
  // const { id, lang } = params;
  const id = '175';
  const [session, event] = await Promise.all([getSession(), fetchEvent(id)]);
  const token = session?.token;
  const applications = await fetchEventApplications(token, id);


  const tabsData: Record<string, string> = {
    approved: 'Одобренные',
    rejected: 'Отклонённые',
    accepted: 'Новые в ожидании',
    // paid: 'Оплаченные',
  };
  
  // const tabsDataPaid: Record<string, string> = {
  //   all: 'Все',
  //   paid: 'Оплаченные',
  //   unpaid: 'Не внесли плату',
  // };

  return (
    <CustomSection className="relative bg-transparent">
      <ContentWraper className="items-start pb-10">
        {/* <div className="flex justify-between">
          <Tabs
            defaultValue={Object.keys(tabsData)[0]}
            className="w-full"
            // onValueChange={onTabSelect}
            // value={selectedTabValue}
          >
            <ScrollArea className="-mx-4 w-screen sm:mx-0 sm:w-full">
              <TabsList className="mb-10 flex w-fit justify-between bg-transparent text-text-mutedLight sm:mx-auto">
                {Object.entries(tabsData).map(([key, value]) => (
                  <TabsTrigger
                    key={key}
                    className={cn(
                      'first-of-type:ml-4 last-of-type:mr-4',
                      'sm:first-of-type:ml-0 sm:last-of-type:mr-0',
                    )}
                    value={key}
                  >
                    {value}
                  </TabsTrigger>
                ))}
              </TabsList>
              <ScrollBar className="hidden" orientation="horizontal" />
            </ScrollArea>
          </Tabs>
        </div> */}

        <EventApplications applications={applications} tabsData={tabsData} />
      </ContentWraper>
    </CustomSection>
  );
}
