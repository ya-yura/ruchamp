import { Container } from '@/components/container';
import { Locale } from '@/i18n.config';
import { H4 } from '@/components/text';

import { getSession } from '@/lib/actions/auth';
import { UserInfo } from '@/lib/definitions';
import { Hero } from '@/components/hero';
import { ProfileActionButtons } from './profile-action-buttons';
import { ProfileColoredCards } from './profile-colored-cards';
import { ProfileMatches } from './profile-matches';
import { fetchAthleteMatches } from '@/lib/data';

const matchesTabsData: Record<'upcoming' | 'past' | 'canceled', string> = {
  upcoming: 'Будут',
  past: 'Были',
  canceled: 'Отменены',
};

const tabsData2: Record<string, string> = {
  capitan: 'Я капитан',
  member: 'Я участник',
};

export default async function AthleteProfile({
  params,
}: {
  params: { lang: Locale };
}) {
  const { lang } = params;
  const id = 171;
  const isOwner = true;
  const badges = ['Главное', 'Айкидо', 'Греко-римская борьба'];

  const session = await getSession();
  const token = session?.token;
  const matches = await fetchAthleteMatches(token);
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
        buttons={
          <ProfileActionButtons token={token} isOwner={isOwner} lang={lang} />
        }
        image={user.roleInfo.image_field || ''}
        isOwner={isOwner}
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

      <div>
        <div className="flex w-full items-center justify-between">
          <h5 className="text-xl font-light tracking-tighter text-ColorsGrey26 md:text-[28px]">
            Мои команды
          </h5>
        </div>
        {/* <Tabs
          defaultValue={Object.keys(tabsData)[0]}
          className="w-full "
          // onValueChange={onTabSelect}
          // value={selectedTabValue}
        >
          <ScrollArea className="-mx-4 w-screen sm:mx-0 sm:w-full">
            <TabsList className="mb-1 flex w-fit justify-between bg-transparent text-text-mutedLight">
              {Object.entries(tabsData2).map(([key, value]) => (
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
        </Tabs> */}
        <ul className="mb-10 flex gap-4">
          {/* {events.map((event) => (
                  <BigCardWithImageAthlete
                    key={event.id}
                    type="event"
                    id={event.id}
                    name={event.name}
                    date={event.date}
                    location={event.location}
                    lang={lang}
                  />
                ))} */}
        </ul>
      </div>
    </Container>
  );
}
