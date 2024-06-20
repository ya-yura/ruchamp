import { Container } from '@/components/container';
import { Locale } from '@/i18n.config';

import { H4 } from '@/components/text';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { CustomSection } from '@/components/custom-section';
import { ContentWraper } from '@/components/content-wraper';
import { Badges } from '../../(unprotected)/event/[id]/badges';
import { H1 } from '@/components/text';
import { Button } from '@/components/ui/button';
import {
  TextCardColored,
  TextCardColoredProps,
} from '@/components/cards/text-card-colored';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { BigCardWithImage } from '@/components/cards/big-card-with-image';
import MatchesField from '../../(unprotected)/event/[id]/matches/matches-events-tabs-athlete';

export default function AthleteProfile() {
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
      event_name: 'Оборот плод предоставить.',
      location: 'г. Устюжна, пр. Профсоюзный, д. 5 стр. 471, 074626',
      org_name: '123',
      name: 'Предварительный раунд',
      sport_name: 'Айкидо',
      category_type: '2-й юношеский разряд',
      start_datetime: '2024-05-21T10:29:12.818092',
      end_datetime: '2024-05-21T10:39:12.818092',
      nominal_time: 36000,
      mat_vol: 4,
      age_min: 0,
      age_max: 0,
      weight_category: 'Тяжёлый',
      weight_min: 90.0,
      weight_max: 100.0,
      gender: false,
      athlete_result: 'Did not compete in this match',
    },

  ];

  return (
    <>
      <Container className="min-h-screen">
        <div className="w-full">
          <div
            className={cn(
              `absolute mt-[-92px] flex h-[720px] w-full items-end overflow-hidden`,
            )}
            // ref={refContainer}
          >
            <Image
              className=""
              src={`/ru/images/mock-event-bg/${id.toString()[id.toString().length - 1]}.avif`}
              alt="Обложка"
              fill={true}
              style={{
                objectFit: 'cover',
                // transform: `translateY(${8 - progress * 15}vh)`,
                backgroundPosition: 'top',
                scale: '130%',
              }}
            />
            <div className="bottom-0 left-0 right-0 top-0 h-full w-full bg-primary-almostBlack opacity-50"></div>
          </div>
          <CustomSection className="relative h-[590px] items-start  bg-transparent">
            <ContentWraper className="h-[590px] justify-between">
              <Badges types={badges} />
              <div className="relative flex flex-col gap-10">
                <div>
                  <H1 className="inline">Игорь Петрович Смирнов</H1>
                  {isOwner && (
                    <Button variant={'ghost'}>
                      <Image
                        className="ml- inline"
                        src={'/images/icons/pencil.svg'}
                        alt=""
                        width={32}
                        height={32}
                      />
                    </Button>
                  )}
                </div>
                <div className="mb-[87px] flex justify-between">
                  <div className="flex gap-6">
                    {' '}
                    <Button variant="ruchampDefault">Создать команду</Button>
                    <Button variant="ruchampTransparent">
                      <Image
                        className="mr-3 inline"
                        src={'/images/icons/picture-in-picture.svg'}
                        alt=""
                        width={20}
                        height={20}
                      />
                      Обновить фото
                    </Button>
                  </div>
                  <Button variant="ruchampTransparent">Изменить пароль</Button>
                </div>
              </div>
            </ContentWraper>
          </CustomSection>
          <CustomSection className="relative pt-[76px]">
            <ContentWraper>
              <div className="flex w-full flex-col gap-9">
                <ColoredCards />
                <div>
                  <div className="flex w-full items-center justify-between">
                    <h5 className="text-xl font-light tracking-tighter text-ColorsGrey26 md:text-[28px]">
                      Мои мероприятия
                    </h5>
                  </div>

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
                  <MatchesField matches={matches} />
                </div>

                <div className="flex w-full items-center justify-between">
                  <h5 className="text-xl font-light tracking-tighter text-ColorsGrey26 md:text-[28px]">
                    Мои команды
                  </h5>
                </div>
                <Tabs
                  defaultValue={Object.keys(tabsData)[0]}
                  className="mb-10  w-full "
                  // onValueChange={onTabSelect}
                  // value={selectedTabValue}
                >
                  <ScrollArea className="-mx-4 w-screen sm:mx-0 sm:w-full">
                    <TabsList className="mb-10 flex w-fit justify-between bg-transparent text-text-mutedLight">
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
              </div>
            </ContentWraper>
          </CustomSection>
        </div>
      </Container>
    </>
  );
}

function ColoredCards() {
  const textCardsData: TextCardColoredProps[] = [
    {
      title: '238 кг',
      text: 'Мой вес',
      className: 'bg-pistachio',
      titleStyles: 'text-ColorsGrey14 font-black',
      textStyles: 'text-ColorsGrey26',
    },
    {
      title: '31 февраля 1888',
      text: 'Дата моего рожденияh',
      className: 'bg-orange',
      titleStyles: 'text-ColorsGrey14 font-black',
      textStyles: 'text-ColorsGrey26',
    },
    {
      title: 'Дата моего рождения',
      text: 'В самбо',
      className: 'bg-purple',
      titleStyles: 'text-ColorsGrey98 font-black',
      textStyles: 'text-ColorsGrey98',
    },
    {
      title: '16 шт, 2 шт, 7 шт',
      text: 'Медалей в самбо',
      className: 'bg-neutralForeground3',
      titleStyles: 'text-ColorsGrey98 font-black',
      textStyles: 'text-ColorsGrey98',
    },
  ];

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-black px-6 py-7">
      <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {textCardsData.map((card) => (
          <TextCardColored
            key={card.title}
            title={card.title}
            text={card.text}
            className={card.className}
            titleStyles={card.titleStyles}
            textStyles={card.textStyles}
          />
        ))}
      </ul>
    </div>
  );
}
