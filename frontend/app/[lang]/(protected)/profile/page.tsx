import { Container } from '@/components/container';
import { Locale } from '@/i18n.config';
import { H4 } from '@/components/text';
import { getSession } from '@/lib/actions/auth';
import { UserInfo } from '@/lib/definitions';
import { Hero } from '@/components/hero';
import { ProfileActionButtons } from './profile-action-buttons';
import { ProfileColoredCards } from './profile-colored-cards';
import { ProfileMatches } from './profile-matches';
import {
  fetchAthleteMatches,
  fetchAthleteTeams,
  fetchAthleteApplications,
} from '@/lib/data';
import { ProfileTeams } from './profile-teams';
import { userRoles } from '@/lib/constants';
import { ProfileApplications } from './profile-applications';
import { CustomSection } from '@/components/custom-section';
import { ContentWraper } from '@/components/content-wraper';

const matchesTabsData: Record<'upcoming' | 'past' | 'canceled', string> = {
  upcoming: 'Будут',
  past: 'Были',
  canceled: 'Отменены',
};

const applicationsTabsData: Record<
  'accepted' | 'approved' | 'paid' | 'rejected',
  string
> = {
  accepted: 'Отправленные',
  approved: 'Ждут оплату',
  paid: 'Оплаченные',
  rejected: 'Отклонённые',
};

const teamsTabsData: Record<string, string> = {
  capitan: 'Я капитан',
  member: 'Я участник',
};

const generalTabsData: Record<string, string> = {
  main: 'Главное',
  applications: 'Заявки',
  results: 'Результаты',
  teams: 'Команды',
};

export default async function AthleteProfile({
  params,
}: {
  params: { lang: Locale };
}) {
  const { lang } = params;
  const session = await getSession();
  const token = session?.token;
  const [matches, teams, applications] = await Promise.all([
    fetchAthleteMatches(token),
    fetchAthleteTeams(token),
    fetchAthleteApplications(token),
  ]);

  const user: UserInfo | null = session
    ? {
        basicInfo: session.user[1],
        roleInfo: session.user[0],
      }
    : null;

  if (!user) {
    return (
      <Container className="min-h-screen">
        <H4>Пользователь не найден</H4>
      </Container>
    );
  }

  const userFullName = `${user.basicInfo.name} ${user.basicInfo.fathername} ${user.basicInfo.sirname}`;

  if (user.basicInfo.role_id === +userRoles['organizer']) {
    return (
      <Container className="min-h-screen">
        <H4>Страница профиля организатора в разработке</H4>
      </Container>
    );
  }

  return (
    <Container className="min-h-screen">
      <Hero
        id={user.roleInfo.id}
        title={userFullName}
        badges={user.roleInfo.sport_types}
        buttons={<ProfileActionButtons user={user} token={token} lang={lang} />}
        image={user.roleInfo.image_field || ''}
        lang={lang}
      />
      <ProfileColoredCards
        weight={user.roleInfo.weight}
        birthdate={user.basicInfo.birthdate}
        grades={user.roleInfo.grades}
        achievements={user.roleInfo.achievements}
      />
      {!!matches?.length ? (
        <ProfileMatches
          matches={matches}
          tabsData={matchesTabsData}
          lang={lang}
        />
      ) : (
        <NoDataSection message={'Вы пока что не участвуете в мероприятиях'} />
      )}

      {!!applications?.length ? (
        <ProfileApplications
          token={token}
          applications={applications}
          tabsData={applicationsTabsData}
          lang={lang}
        />
      ) : (
        <NoDataSection message={'У вас пока что нет заявок на мероприятия'} />
      )}

      {!!teams?.length ? (
        <ProfileTeams
          athleteId={user.roleInfo.id}
          teams={teams}
          tabsData={teamsTabsData}
          lang={lang}
        />
      ) : (
        <NoDataSection message={'Вы пока что не состоите ни в одной команде'} />
      )}
    </Container>
  );
}

function NoDataSection({ message }: { message: string }) {
  return (
    <CustomSection className="relative pt-[76px]">
      <ContentWraper>
        <h5 className="mb-10 mr-auto text-xl font-light tracking-tighter text-ColorsGrey26 md:text-[28px]">
          {message}
        </h5>
      </ContentWraper>
    </CustomSection>
  );
}
