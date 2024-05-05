import { TypeEvent } from './definitions';

export type TypeSportsTypes =
  | 'Айкидо'
  | 'Бокатор'
  | 'Бокс'
  | 'Бразильское джиу-джитсу'
  | 'Боевое самбо'
  | 'Вольная борьба'
  | 'Греко-римская борьба'
  | 'Джиу-джитсу'
  | 'Дзюдо'
  | 'Джиткундо'
  | 'Капоэйра'
  | 'Карате'
  | 'Кикбоксинг'
  | 'Краби крабонг'
  | 'Кунг-фу'
  | 'ММА'
  | 'Муай Тай'
  | 'Рукопашный бой'
  | 'Сават'
  | 'Самбо'
  | 'Саньда'
  | 'Сумо'
  | 'Тайский бокс'
  | 'Тхэквондо'
  | 'Ушу'
  | 'Эскрима';

export const sportsTypes: TypeSportsTypes[] = [
  'Айкидо',
  'Бокатор',
  'Бокс',
  'Бразильское джиу-джитсу',
  'Боевое самбо',
  'Вольная борьба',
  'Греко-римская борьба',
  'Джиу-джитсу',
  'Дзюдо',
  'Джиткундо',
  'Капоэйра',
  'Карате',
  'Кикбоксинг',
  'Краби крабонг',
  'Кунг-фу',
  'ММА',
  'Муай Тай',
  'Рукопашный бой',
  'Сават',
  'Самбо',
  'Саньда',
  'Сумо',
  'Тайский бокс',
  'Тхэквондо',
  'Ушу',
  'Эскрима',
];

export const testFutureData: TypeEvent[] = [
  {
    name: 'Тест будущей даты. Турнир чемпионов.',
    start_datetime: '2024-06-20T09:12:58.544900',
    location: 'с. Апшеронск, пер. Машиностроителей, д. 2 к. 6, 679693',
    event_order:
      'Приличный фонарик полевой коммунизм. Инфекция бетонный нажать коммунизм командование обида степь.\n' +
      'Зима возмутиться пятеро домашний командир степь тяжелый. Оставить карман витрина процесс космос.',
    geo: '56.249564,18.496308',
    end_datetime: '2024-04-06T09:12:58.544903',
    id: 10000001,
    organizer_id: 715,
    event_system: 'багровый',
    image_field: 'https://placekitten.com/976/755',
  },
  {
    name: 'Тест будущей даты. Соревнование по арм рестлингу',
    start_datetime: '2024-08-20T09:12:58.545157',
    location: 'п. Кажим, пер. Малиновый, д. 623, 162586',
    event_order:
      'Пропадать встать дрогнуть аж потянуться. Необычный зарплата чем райком желание естественный. Запеть наслаждение рота наткнуться предоставить.',
    geo: '-77.529661,75.594681',
    end_datetime: '2024-04-29T09:12:58.545160',
    id: 10000002,
    organizer_id: 1242,
    event_system: 'приятель',
    image_field: 'https://dummyimage.com/173x602',
  },
  {
    name: 'Утренняя заря',
    start_datetime: '2024-04-30T06:00:00',
    location: 'ул. Солнечная, д. 25, г. Рассветное',
    event_order:
      'Пробуждение души под лучами солнца. Запах свежей зари наполняет воздух.',
    geo: '52.370216, 4.895168',
    end_datetime: '2024-04-15T07:00:00',
    id: 10000003,
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
    id: 10000004,
    organizer_id: 2103,
    event_system: 'exhibition',
    image_field: 'https://placeimg.com/640/480/art',
  },
  {
    name: 'Cooking Class: Italian Cuisine',
    start_datetime: '2024-06-20T18:30:00',
    location: 'Culinary Studio, 456 Oak St, Foodtown',
    event_order:
      'Learn the secrets of authentic Italian cooking from experienced chefs.',
    geo: '34.052235, -118.243683',
    end_datetime: '2024-04-20T20:30:00',
    id: 10000005,
    organizer_id: 1899,
    event_system: 'cooking',
    image_field: 'https://placeimg.com/640/480/food',
  },
  {
    name: 'Tech Talk: Artificial Intelligence Trends',
    start_datetime: '2024-09-25T14:00:00',
    location: 'Tech Hub, 789 Tech Ave, Silicon Valley',
    event_order:
      'Explore the latest advancements and future prospects in AI technology.',
    geo: '37.774929, -122.419418',
    end_datetime: '2024-04-25T16:00:00',
    id: 10000006,
    organizer_id: 1987,
    event_system: 'tech',
    image_field: 'https://placeimg.com/640/480/tech',
  },
  {
    name: 'Yoga Retreat: Harmony of Body and Mind',
    start_datetime: '2024-10-01T09:00:00',
    location: 'Serene Valley Retreat Center, 100 Tranquility Rd, Peaceville',
    event_order:
      'Immerse yourself in a weekend of yoga, meditation, and self-reflection amidst nature.',
    geo: '36.778261, -119.417932',
    end_datetime: '2024-06-03T17:00:00',
    id: 10000007,
    organizer_id: 2208,
    event_system: 'retreat',
    image_field: 'https://placeimg.com/640/480/yoga',
  },
  {
    name: 'Book Club: Fiction Favorites',
    start_datetime: '2024-12-18T19:00:00',
    location: 'Main Library, 789 Reading Blvd, Booktown',
    event_order:
      "Join fellow book lovers to discuss this month's selection of captivating fiction novels.",
    geo: '41.878113, -87.629799',
    end_datetime: '2024-04-18T21:00:00',
    id: 10000008,
    organizer_id: 2055,
    event_system: 'book_club',
    image_field: 'https://placeimg.com/640/480/books',
  },
  {
    name: 'Music Concert: Jazz Fusion Night',
    start_datetime: '2024-11-15T20:00:00',
    location: 'Jazz Lounge, 456 Groove St, Melody City',
    event_order:
      'Experience a blend of traditional jazz with modern fusion elements, featuring renowned musicians.',
    geo: '34.052235, -118.243683',
    end_datetime: '2024-05-15T23:00:00',
    id: 10000009,
    organizer_id: 2150,
    event_system: 'concert',
    image_field: 'https://placeimg.com/640/480/music',
  },
  {
    name: 'Fitness Bootcamp: Shape Up Challenge',
    start_datetime: '2024-07-22T07:30:00',
    location: 'FitZone Gym, 789 Fitness Ave, Healthville',
    event_order:
      'Get ready for an intense workout program designed to help you achieve your fitness goals.',
    geo: '37.774929, -122.419418',
    end_datetime: '2024-04-22T09:30:00',
    id: 100000010,
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
    id: 100000011,
    organizer_id: 2255,
    event_system: 'cleanup',
    image_field: 'https://placeimg.com/640/480/nature',
  },
  {
    name: 'Business Seminar: Entrepreneurship 101',
    start_datetime: '2024-08-30T15:00:00',
    location: 'Business Center, 789 Entrepreneur St, Startup City',
    event_order:
      'Learn the fundamentals of starting and growing a successful business from industry experts.',
    geo: '37.774929, -122.419418',
    end_datetime: '2024-04-30T17:00:00',
    id: 100000012,
    organizer_id: 2301,
    event_system: 'seminar',
    image_field: 'https://placeimg.com/640/480/business',
  },
  {
    name: 'Photography Workshop: Capturing the Essence of Nature',
    start_datetime: '2024-09-08T14:00:00',
    location: 'Wilderness Park, 789 Nature Trail, Scenic City',
    event_order:
      'Join professional photographers for a hands-on workshop on nature photography techniques.',
    geo: '38.581571, -121.494399',
    end_datetime: '2024-05-08T17:00:00',
    id: 100000013,
    organizer_id: 2357,
    event_system: 'workshop',
    image_field: 'https://placeimg.com/640/480/photography',
  },
  {
    name: 'Film Screening: Classic Cinema Night',
    start_datetime: '2024-06-28T19:30:00',
    location: 'Vintage Theater, 456 Retro Ave, Cinematown',
    event_order:
      'Relive the golden era of cinema with a screening of timeless classics from around the world.',
    geo: '34.052235, -118.243683',
    end_datetime: '2024-04-28T22:00:00',
    id: 100000014,
    organizer_id: 2402,
    event_system: 'screening',
    image_field: 'https://placeimg.com/640/480/movie',
  },
];
