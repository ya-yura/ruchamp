'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { ContentWraper } from '../../ui/content-wraper';
import { DatePicker } from './date-picker';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FilterByType } from './filter-by-type';
import { TypeSportsTypes } from '@/lib/constants';
import { useEffect, useState } from 'react';
import { eventsApi } from '@/lib/api/eventsApi';
import { TypeEvent } from '@/lib/definitions';
import { CardEvent } from './card-event';

const mockEvents: TypeEvent[] = [
  {
    name: 'Падать экзамен видимо процесс запеть лететь плавно увеличиваться.',
    start_datetime: '2024-03-23T09:12:58.525172',
    location: 'п. Камышлов, алл. Терешковой, д. 9/7, 642660',
    event_order: 'Сынок подземный вперед угодный. Головной миг левый.',
    geo: '-80.329837,-58.912555',
    end_datetime: '2024-04-09T09:12:58.525180',
    id: 1,
    organizer_id: 1608,
    event_system: 'выразить',
    image_field: 'https://placekitten.com/304/928',
  },
  {
    name: 'Прощение написать выражаться факультет намерение медицина багровый.',
    start_datetime: '2024-03-09T09:12:58.529766',
    location: 'ст. Забайкальск, бул. Огородный, д. 832 к. 7, 373933',
    event_order:
      'Сустав ярко функция хотеть смертельный избегать. Ботинок обида руководитель сынок блин.\nМеталл редактор новый прежде. Песня приличный покинуть крутой свежий медицина. Приличный житель о непривычный.',
    geo: '55.5127885,-23.913961',
    end_datetime: '2024-04-26T09:12:58.529773',
    id: 2,
    organizer_id: 1567,
    event_system: 'набор',
    image_field: 'https://picsum.photos/149/263',
  },
  {
    name: 'Витрина результат магазин.',
    start_datetime: '2024-03-10T09:12:58.530086',
    location: 'г. Заводоуковск, наб. Баумана, д. 522 к. 3/8, 830362',
    event_order:
      'Рабочий доставать достоинство направо неудобно. Вскинуть уронить неправда войти передо правление. Космос цвет пастух прелесть вчера мелочь.',
    geo: '76.3580395,-62.629452',
    end_datetime: '2024-04-23T09:12:58.530090',
    id: 3,
    organizer_id: 1431,
    event_system: 'мелочь',
    image_field: 'https://placekitten.com/152/138',
  },
  {
    name: 'Утренняя заря',
    start_datetime: '2024-04-15T06:00:00',
    location: 'ул. Солнечная, д. 25, г. Рассветное',
    event_order:
      'Пробуждение души под лучами солнца. Запах свежей зари наполняет воздух.',
    geo: '52.370216, 4.895168',
    end_datetime: '2024-04-15T07:00:00',
    id: 4,
    organizer_id: 2001,
    event_system: 'рассвет',
    image_field: 'https://placeimg.com/640/480/nature',
  },
  {
    name: 'Art Exhibition: Reflections',
    start_datetime: '2024-05-10T10:00:00',
    location: 'Art Gallery, 123 Main St, Cityville',
    event_order:
      'A showcase of contemporary art exploring themes of introspection and self-discovery.',
    geo: '40.712776, -74.005974',
    end_datetime: '2024-05-30T18:00:00',
    id: 5,
    organizer_id: 2103,
    event_system: 'exhibition',
    image_field: 'https://placeimg.com/640/480/art',
  },
  {
    name: 'Cooking Class: Italian Cuisine',
    start_datetime: '2024-04-20T18:30:00',
    location: 'Culinary Studio, 456 Oak St, Foodtown',
    event_order:
      'Learn the secrets of authentic Italian cooking from experienced chefs.',
    geo: '34.052235, -118.243683',
    end_datetime: '2024-04-20T20:30:00',
    id: 6,
    organizer_id: 1899,
    event_system: 'cooking',
    image_field: 'https://placeimg.com/640/480/food',
  },
  {
    name: 'Tech Talk: Artificial Intelligence Trends',
    start_datetime: '2024-04-25T14:00:00',
    location: 'Tech Hub, 789 Tech Ave, Silicon Valley',
    event_order:
      'Explore the latest advancements and future prospects in AI technology.',
    geo: '37.774929, -122.419418',
    end_datetime: '2024-04-25T16:00:00',
    id: 7,
    organizer_id: 1987,
    event_system: 'tech',
    image_field: 'https://placeimg.com/640/480/tech',
  },
  {
    name: 'Yoga Retreat: Harmony of Body and Mind',
    start_datetime: '2024-06-01T09:00:00',
    location: 'Serene Valley Retreat Center, 100 Tranquility Rd, Peaceville',
    event_order:
      'Immerse yourself in a weekend of yoga, meditation, and self-reflection amidst nature.',
    geo: '36.778261, -119.417932',
    end_datetime: '2024-06-03T17:00:00',
    id: 8,
    organizer_id: 2208,
    event_system: 'retreat',
    image_field: 'https://placeimg.com/640/480/yoga',
  },
  {
    name: 'Book Club: Fiction Favorites',
    start_datetime: '2024-04-18T19:00:00',
    location: 'Main Library, 789 Reading Blvd, Booktown',
    event_order:
      "Join fellow book lovers to discuss this month's selection of captivating fiction novels.",
    geo: '41.878113, -87.629799',
    end_datetime: '2024-04-18T21:00:00',
    id: 9,
    organizer_id: 2055,
    event_system: 'book_club',
    image_field: 'https://placeimg.com/640/480/books',
  },
  {
    name: 'Music Concert: Jazz Fusion Night',
    start_datetime: '2024-05-15T20:00:00',
    location: 'Jazz Lounge, 456 Groove St, Melody City',
    event_order:
      'Experience a blend of traditional jazz with modern fusion elements, featuring renowned musicians.',
    geo: '34.052235, -118.243683',
    end_datetime: '2024-05-15T23:00:00',
    id: 10,
    organizer_id: 2150,
    event_system: 'concert',
    image_field: 'https://placeimg.com/640/480/music',
  },
  {
    name: 'Fitness Bootcamp: Shape Up Challenge',
    start_datetime: '2024-04-22T07:30:00',
    location: 'FitZone Gym, 789 Fitness Ave, Healthville',
    event_order:
      'Get ready for an intense workout program designed to help you achieve your fitness goals.',
    geo: '37.774929, -122.419418',
    end_datetime: '2024-04-22T09:30:00',
    id: 11,
    organizer_id: 1955,
    event_system: 'fitness',
    image_field: 'https://placeimg.com/640/480/sports',
  },
  {
    name: 'Community Cleanup Day',
    start_datetime: '2024-05-05T09:00:00',
    location: 'City Park, 123 Green Ave, Cleanville',
    event_order:
      'Join hands with neighbors to beautify our community by cleaning up litter and planting trees.',
    geo: '40.712776, -74.005974',
    end_datetime: '2024-05-05T12:00:00',
    id: 12,
    organizer_id: 2255,
    event_system: 'cleanup',
    image_field: 'https://placeimg.com/640/480/nature',
  },
  {
    name: 'Business Seminar: Entrepreneurship 101',
    start_datetime: '2024-04-30T15:00:00',
    location: 'Business Center, 789 Entrepreneur St, Startup City',
    event_order:
      'Learn the fundamentals of starting and growing a successful business from industry experts.',
    geo: '37.774929, -122.419418',
    end_datetime: '2024-04-30T17:00:00',
    id: 13,
    organizer_id: 2301,
    event_system: 'seminar',
    image_field: 'https://placeimg.com/640/480/business',
  },
];

export function EventsTabs({
  token,
  // serverEvents,
}: {
  token: string;
  // serverEvents: Array<TypeEvent>;
}) {
  const [selectedSportTypes, setSelectedSportTypes] = useState<
    Array<TypeSportsTypes>
  >([]);
  const [events, setEvents] = useState<Array<TypeEvent>>([]);

  useEffect(() => {
    eventsApi.getEvents(token).then((res) => setEvents(res));
  }, []);

  return (
    <section className="relative mt-[-92px] flex w-full flex-col items-center justify-between bg-[#0A0A0A] px-[72px] pt-[92px]">
      <div className="absolute h-[853px] w-full">
        <Image
          className="opacity-30"
          src="/ru/images/background-events.jpeg"
          alt={'ДОБАВИТЬ ОПИСАНИЕ'}
          fill={true}
          style={{ objectFit: 'cover' }}
        />
      </div>
      <ContentWraper className="h-fit justify-between">
        <Tabs defaultValue="futureEvents" className="relative mx-auto w-full">
          <div className="w-full">
            <TabsList className="mx-auto mb-5 flex w-[500px] justify-between bg-transparent text-[#D6D6D6]">
              <TabsTrigger value="futureEvents">Будущие события</TabsTrigger>
              <TabsTrigger value="pastEvents">Прошедшие события</TabsTrigger>
              <TabsTrigger value="usersEvents">Ваши события</TabsTrigger>
            </TabsList>
            <div className="absolute right-0 top-2 flex items-center space-x-2">
              <Switch id="showMap" />
              <Label className="text-sm font-normal" htmlFor="showMap">
                На карте
              </Label>
            </div>
          </div>
          <DatePicker className="mb-4 flex justify-center" />
          <FilterByType setSelected={setSelectedSportTypes} />
          <TabsContent className="grid grid-cols-3 gap-6" value="futureEvents">
            {events.slice(0, 10).map((event) => (
              <CardEvent key={event.id} event={event} />
            ))}
          </TabsContent>
          <TabsContent value="pastEvents">
            <p>Прошедшие события</p>
          </TabsContent>
          <TabsContent value="usersEvents">
            <p>Ваши события</p>
          </TabsContent>
        </Tabs>
      </ContentWraper>
    </section>
  );
}
