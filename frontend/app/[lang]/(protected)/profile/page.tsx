import { Container } from '@/components/container';
import { Locale } from '@/i18n.config';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { CustomSection } from '@/components/custom-section';
import { ContentWraper } from '@/components/content-wraper';
import { Badges } from '../../(unprotected)/event/[id]/badges';
import { H1, H4 } from '@/components/text';
import { Button } from '@/components/ui/button';
import {
  TextCardColored,
  TextCardColoredProps,
} from '@/components/cards/text-card-colored';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { BigCardWithImageAthlete } from '@/components/cards/big-card-with-image-athlete';
import MatchesFieldAthlete from '../../(unprotected)/event/[id]/matches/matches-field-athlete';
import { CarouselContent } from '@/components/ui/carousel';
import { BigCardsWithImageFieldAthlete } from '@/components/cards/big-cards-with-image-field-athlete';
import { getSession } from '@/lib/actions/auth';
import { UserInfo } from '@/lib/definitions';
import { Hero } from '@/components/hero';
import { ProfileActionButtons } from './profile-action-buttons';
import { ProfileColoredCards } from './profile-colored-cards';

export default async function AthleteProfile({
  params,
}: {
  params: { lang: Locale };
}) {
  const { lang } = params;
  const id = 171;
  const isOwner = true;
  const badges = ['Главное', 'Айкидо', 'Греко-римская борьба'];

  const tabsData: Record<string, string> = {
    upcoming: 'Будут',
    past: 'Были',
    canceled: 'Отменены',
  };

  const tabsData2: Record<string, string> = {
    capitan: 'Я капитан',
    member: 'Я участник',
  };

  const matches = [
    {
      id: 6,
      match_id: 4,
      event_id: 2,
      date: '12 мая 2024',
      match_type: 'Предварительный раунд',
      sport_type: 'Греко-римская борьба',
      gender: false,
      weight_min: 90.0,
      weight_max: 100.0,
      athlete_result: '1/4',
    },
    {
      id: 7,
      match_id: 4,
      event_id: 2,
      date: '30 сентября 2024',
      match_type: 'Утешительный раунд',
      sport_type: 'Греко-римская борьба',
      gender: false,
      weight_min: 90.0,
      weight_max: 100.0,
      athlete_result: '1/16',
    },
    {
      id: 6,
      match_id: 4,
      event_id: 2,
      date: '1 мая 2022',
      match_type: 'Полуфиналы',
      sport_type: 'Греко-римская борьба',
      gender: false,
      weight_min: 90.0,
      weight_max: 100.0,
      athlete_result: '1/2',
    },
    {
      id: 6,
      match_id: 4,
      event_id: 2,
      date: '30 августа 2021',
      match_type: 'Жеребьевка',
      sport_type: 'Греко-римская борьба',
      gender: false,
      weight_min: 90.0,
      weight_max: 100.0,
      athlete_result: '3 место',
    },
  ];

  const session = await getSession();
  const token = session?.token;
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
      <CustomSection className="relative pt-[76px]">
        <ContentWraper className="gap-14">
          <ProfileColoredCards
            weight={user.roleInfo.weight}
            birthdate={user.basicInfo.birthdate}
            grades={user.roleInfo.grades}
            achievements={user.roleInfo.achievements}
          />
          <h5 className="text-xl font-light tracking-tighter text-ColorsGrey26 md:text-[28px]">
            Мои мероприятия
          </h5>
          <Tabs
            defaultValue={Object.keys(tabsData)[0]}
            className="w-full "
            // onValueChange={onTabSelect}
            // value={selectedTabValue}
          >
            <ScrollArea className="-mx-4 w-screen sm:mx-0 sm:w-full">
              <TabsList className="mb-2 flex w-fit justify-between bg-transparent text-text-mutedLight">
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
          <MatchesFieldAthlete matches={matches} eventId={'171'} lang={lang} />

          <div>
            <div className="flex w-full items-center justify-between">
              <h5 className="text-xl font-light tracking-tighter text-ColorsGrey26 md:text-[28px]">
                Мои команды
              </h5>
            </div>
            <Tabs
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
            </Tabs>
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
        </ContentWraper>
      </CustomSection>
    </Container>
  );
}
