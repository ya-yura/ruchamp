import { cn } from '@/lib/utils';
import { ContentWraper } from '@/components/content-wraper';
import { CustomSection } from '@/components/custom-section';
import { Locale } from '@/i18n.config';
import { getSession } from '@/lib/actions/auth';
import { fetchEvent, fetchEventApplications } from '@/lib/data';
import { EventApplications } from './events-applications';
import { INFO } from './const';
import { PersonDescriptionOnCard } from '@/components/text';

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

  // Делаем проверку на отсутствие заявок. Здесь же обрабатывается и ошибка загрузки заявок
  if (!applications) {
    return (
      <CustomSection className="relative bg-transparent">
        <ContentWraper className="items-start pb-10">
          <PersonDescriptionOnCard className="mb-5 mr-auto text-base text-background">
            Заявок пока что нет
          </PersonDescriptionOnCard>
        </ContentWraper>
      </CustomSection>
    );
  }

  const paid = applications?.paid || []; // Добавляем "|| []", чтобы у нас хотя бы пустой массив был, а не "undefined"
  const approved = applications?.approved || [];
  const accepted = applications?.accepted || [];
  const rejected = applications?.rejected || []; // почему отклоннённые заявки куда-то пропали?

  const tabsData: Record<string, string> = {
    accepted: 'Новые в ожидании',
    approved: 'Одобренные',
    rejected: 'Отклонённые',
    paid: 'Оплаченные',
  };

  // const tabsDataAdd: Record<string, string> = {
  //   all: 'Все',
  //   paid: 'Оплаченные',
  //   unpaid: 'Не внесли плату',
  // };

  return (
    <CustomSection className="relative bg-transparent">
      <ContentWraper className="items-start pb-10">
        {Object.keys(applications).length === 0 ? (
          <PersonDescriptionOnCard className="mb-5 mr-auto text-base text-background">
            Заявок пока что нет
          </PersonDescriptionOnCard>
        ) : (
          <EventApplications
            paid={paid}
            accepted={accepted}
            approved={approved}
            rejected={rejected}
            tabsData={tabsData}
            // tabsDataAdd={tabsDataAdd}
          />
        )}
      </ContentWraper>
    </CustomSection>
  );
}
