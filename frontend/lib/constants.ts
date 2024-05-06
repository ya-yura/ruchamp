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
  'ММА',
  'Бокс',
  'Карате',
  'Самбо',
  'Дзюдо',
  'Греко-римская борьба',
  'Рукопашный бой',
  'Ушу',
  'Сават',
  'Кунг-фу',
  'Айкидо',
  'Боевое самбо',
  'Вольная борьба',
  'Джиу-джитсу',
  'Капоэйра',
  'Кикбоксинг',
  'Краби крабонг',
  'Муай Тай',
  'Саньда',
  'Джиткундо',
  'Сумо',
  'Бразильское джиу-джитсу',
  'Тайский бокс',
  'Тхэквондо',
  'Бокатор',
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
  {
    name: 'Art Exhibition: Modern Perspectives',
    start_datetime: '2024-07-15T10:00:00',
    location: 'Contemporary Art Gallery, 123 Artistic Blvd, Metropolis',
    event_order:
      'Explore the latest works of contemporary artists pushing the boundaries of expression.',
    geo: '40.712776, -74.005974',
    end_datetime: '2024-07-30T18:00:00',
    id: 100000015,
    organizer_id: 2105,
    event_system: 'exhibition',
    image_field: 'https://placeimg.com/640/480/art',
  },
  {
    name: 'Music Concert: Jazz in the Park',
    start_datetime: '2024-07-22T17:00:00',
    location: 'Central Park Amphitheater, 789 Music Ave, Harmony City',
    event_order:
      'Enjoy an evening of smooth jazz performances by local and guest artists.',
    geo: '40.785091, -73.968285',
    end_datetime: '2024-07-22T21:00:00',
    id: 100000016,
    organizer_id: 2150,
    event_system: 'concert',
    image_field: 'https://placeimg.com/640/480/music',
  },
  {
    name: 'Tech Conference: Future Frontiers',
    start_datetime: '2024-08-10T09:00:00',
    location: 'Innovation Center, 456 Tech Blvd, Techville',
    event_order:
      'Explore emerging technologies and their impact on industries and society.',
    geo: '37.774929, -122.419418',
    end_datetime: '2024-08-12T18:00:00',
    id: 100000017,
    organizer_id: 2203,
    event_system: 'conference',
    image_field: 'https://placeimg.com/640/480/tech',
  },
  {
    name: 'Cooking Class: International Cuisine',
    start_datetime: '2024-08-05T11:00:00',
    location: 'Culinary Institute, 789 Culinary Way, Gourmet Town',
    event_order:
      'Learn to prepare signature dishes from different cuisines around the world.',
    geo: '34.052235, -118.243683',
    end_datetime: '2024-08-05T14:00:00',
    id: 100000018,
    organizer_id: 2256,
    event_system: 'class',
    image_field: 'https://placeimg.com/640/480/cooking',
  },
  {
    name: 'Fashion Show: Haute Couture',
    start_datetime: '2024-08-18T19:00:00',
    location: 'Fashion House, 123 Runway Blvd, Fashion City',
    event_order:
      'Experience the latest trends as top designers showcase their haute couture collections.',
    geo: '34.052235, -118.243683',
    end_datetime: '2024-08-18T22:00:00',
    id: 100000019,
    organizer_id: 2309,
    event_system: 'fashion_show',
    image_field: 'https://placeimg.com/640/480/fashion',
  },
  {
    name: 'Fitness Bootcamp: Total Body Challenge',
    start_datetime: '2024-08-25T06:00:00',
    location: 'FitCamp Gym, 456 Fitness Ave, Health City',
    event_order:
      'Transform your fitness with high-intensity workouts targeting every muscle group.',
    geo: '34.052235, -118.243683',
    end_datetime: '2024-08-25T08:00:00',
    id: 100000020,
    organizer_id: 2350,
    event_system: 'bootcamp',
    image_field: 'https://placeimg.com/640/480/fitness',
  },
  {
    name: 'Literary Festival: Wordsmiths Unite',
    start_datetime: '2024-09-14T12:00:00',
    location: 'City Library, 789 Bookworm Blvd, Literary Town',
    event_order:
      'Celebrate literature with readings, discussions, and book signings by renowned authors.',
    geo: '40.712776, -74.005974',
    end_datetime: '2024-09-16T18:00:00',
    id: 100000021,
    organizer_id: 2405,
    event_system: 'festival',
    image_field: 'https://placeimg.com/640/480/books',
  },
  {
    name: 'Gaming Expo: Virtual Realms',
    start_datetime: '2024-09-28T10:00:00',
    location: 'Tech Expo Center, 456 Gamer Ave, Game City',
    event_order:
      'Immerse yourself in the latest gaming technology and explore virtual worlds.',
    geo: '34.052235, -118.243683',
    end_datetime: '2024-09-30T18:00:00',
    id: 100000022,
    organizer_id: 2455,
    event_system: 'expo',
    image_field: 'https://placeimg.com/640/480/gaming',
  },
  {
    name: 'Yoga Retreat: Mind, Body, Spirit',
    start_datetime: '2024-10-05T08:00:00',
    location: 'Serene Sanctuary, 123 Yoga Ave, Tranquil Town',
    event_order:
      'Rejuvenate your mind, body, and spirit with yoga, meditation, and wellness workshops.',
    geo: '40.712776, -74.005974',
    end_datetime: '2024-10-07T18:00:00',
    id: 100000023,
    organizer_id: 2501,
    event_system: 'retreat',
    image_field: 'https://placeimg.com/640/480/yoga',
  },
  {
    name: 'Science Fair: Exploring Innovations',
    start_datetime: '2024-10-12T09:00:00',
    location: 'Science Museum, 789 Discovery St, Tech City',
    event_order:
      'Discover groundbreaking inventions and scientific breakthroughs by young innovators.',
    geo: '37.774929, -122.419418',
    end_datetime: '2024-10-14T17:00:00',
    id: 100000024,
    organizer_id: 2550,
    event_system: 'fair',
    image_field: 'https://placeimg.com/640/480/science',
  },
  {
    name: 'Dance Workshop: Rhythms of the World',
    start_datetime: '2024-10-20T15:00:00',
    location: 'Dance Studio, 456 Groove Ave, Dance City',
    event_order:
      'Experience the diversity of dance styles from around the globe in this immersive workshop.',
    geo: '34.052235, -118.243683',
    end_datetime: '2024-10-20T18:00:00',
    id: 100000025,
    organizer_id: 2602,
    event_system: 'workshop',
    image_field: 'https://placeimg.com/640/480/dance',
  },
  {
    name: 'Charity Gala: A Night of Giving',
    start_datetime: '2024-11-02T18:00:00',
    location: 'Grand Ballroom, 123 Charity Ave, Generous Town',
    event_order:
      'Support worthy causes and make a difference in the community at this elegant charity event.',
    geo: '40.712776, -74.005974',
    end_datetime: '2024-11-02T23:00:00',
    id: 100000026,
    organizer_id: 2650,
    event_system: 'gala',
    image_field: 'https://placeimg.com/640/480/charity',
  },
  {
    name: 'Travel Expo: Discover Your Next Adventure',
    start_datetime: '2024-11-15T10:00:00',
    location: 'Expo Center, 456 Wanderlust Ave, Travel City',
    event_order:
      'Explore destinations, plan your next trip, and take advantage of exclusive travel deals.',
    geo: '34.052235, -118.243683',
    end_datetime: '2024-11-17T18:00:00',
    id: 100000027,
    organizer_id: 2703,
    event_system: 'expo',
    image_field: 'https://placeimg.com/640/480/travel',
  },
  {
    name: 'Comedy Show: Laughter Therapy',
    start_datetime: '2024-11-25T20:00:00',
    location: 'Comedy Club, 789 Humor Ave, Laugh City',
    event_order:
      'Get ready for a night of side-splitting laughter with top comedians and hilarious acts.',
    geo: '34.052235, -118.243683',
    end_datetime: '2024-11-25T22:00:00',
    id: 100000028,
    organizer_id: 2750,
    event_system: 'comedy_show',
    image_field: 'https://placeimg.com/640/480/comedy',
  },
  {
    name: 'Wine Tasting: Vintages & Varietals',
    start_datetime: '2024-12-08T18:00:00',
    location: 'Winery Estate, 123 Vineyard Rd, Wine City',
    event_order:
      'Savor a selection of fine wines from around the world and discover new favorites.',
    geo: '38.581571, -121.494399',
    end_datetime: '2024-12-08T21:00:00',
    id: 100000029,
    organizer_id: 2801,
    event_system: 'tasting',
    image_field: 'https://placeimg.com/640/480/wine',
  },
  {
    name: 'Cooking Competition: Culinary Clash',
    start_datetime: '2024-12-15T12:00:00',
    location: 'Culinary Arena, 456 Cookoff St, Foodie Town',
    event_order:
      'Watch top chefs compete in a high-stakes culinary showdown showcasing their skills.',
    geo: '34.052235, -118.243683',
    end_datetime: '2024-12-15T15:00:00',
    id: 100000030,
    organizer_id: 2850,
    event_system: 'competition',
    image_field: 'https://placeimg.com/640/480/cooking_competition',
  },
];
