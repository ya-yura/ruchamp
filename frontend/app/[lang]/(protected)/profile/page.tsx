import { Container } from '@/components/container';
import { Locale } from '@/i18n.config';
import { H4 } from '@/components/text';
import { getSession } from '@/lib/actions/auth';
import { UserInfo } from '@/lib/definitions';
import { Hero } from '@/components/hero';
import { ProfileActionButtons } from './profile-action-buttons';
import { ProfileColoredCards } from './profile-colored-cards';
import { ProfileMatches } from './profile-matches';
import { fetchAthleteMatches, fetchAthleteTeams } from '@/lib/data';
import { ProfileTeams } from './profile-teams';

const matchesTabsData: Record<'upcoming' | 'past' | 'canceled', string> = {
  upcoming: 'Будут',
  past: 'Были',
  canceled: 'Отменены',
};

const teamsTabsData: Record<string, string> = {
  capitan: 'Я капитан',
  member: 'Я участник',
};

export default async function AthleteProfile({
  params,
}: {
  params: { lang: Locale };
}) {
  const { lang } = params;
  const session = await getSession();
  const token = session?.token;
  const [matches, teams] = await Promise.all([
    fetchAthleteMatches(token),
    fetchAthleteTeams(token),
  ]);
  const user: UserInfo | null = session
    ? {
        basicInfo: session.user[1],
        roleInfo: session.user[0],
      }
    : null;

  const userFullName = `${user?.basicInfo.name} ${user?.basicInfo.fathername} ${user?.basicInfo.sirname}`;

  if (!user) {
    return <H4>Пользователь не найден</H4>;
  }

  return (
    <Container className="min-h-screen">
      <Hero
        id={user.roleInfo.id}
        title={userFullName}
        badges={user.roleInfo.sport_types}
        buttons={<ProfileActionButtons token={token} lang={lang} />}
        image={user.roleInfo.image_field || ''}
        lang={lang}
      />
      <ProfileColoredCards
        weight={user.roleInfo.weight}
        birthdate={user.basicInfo.birthdate}
        grades={user.roleInfo.grades}
        achievements={user.roleInfo.achievements}
      />
      {matches ? (
        <ProfileMatches
          matches={matches}
          tabsData={matchesTabsData}
          lang={lang}
        />
      ) : (
        <H4>Вы не участвовали в мероприятиях или произошла ошибка загрузки</H4>
      )}

      {teams ? (
        <ProfileTeams
          athleteId={user.roleInfo.id}
          teams={teams}
          tabsData={teamsTabsData}
          lang={lang}
        />
      ) : (
        <H4>
          Вы не являетесь участником ни одной команды или произошла ошибка
          загрузки
        </H4>
      )}
    </Container>
  );
}
