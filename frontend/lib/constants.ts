import { TeamByIdFromServer } from '@/app/[lang]/(protected)/team/[id]/page';
import { Event } from './definitions';

export const sportTypes: string[] = [
  'Кикбоксинг',
  'Бокс',
  'Каратэ',
  'Самбо',
  'Дзюдо',
  'Джиу-джитсу',
  'Греко-римская борьба',
  'Вольная борьба',
  'Рукопашный бой',
  'Ушу',
  'Тхэквондо',
  'Айкидо',
  'Сумо',
  'Тайский бокс',
  'Кудо',
  'Кайдо',
  'Каратэномичи',
  'Кендо',
  'Киокусинкай',
  'Кобудо',
  'Комбат самооборона',
  'Комплексное единоборство',
  'Ориентал',
  'Панкратион',
  'Практическая стрельба',
  'Русское боевое искусство',
  'Современный мечевой бой',
  'Спортивное метание ножа',
  'Спортивный ножевой бой',
];

export const testData: Event[] = [
  {
    name: 'Турнир чемпионов.',
    start_datetime: '2024-04-20T09:12:58.544900',
    start_request_datetime: '2024-04-20T09:12:58.544900',
    location: 'с. Апшеронск, пер. Машиностроителей, д. 2 к. 6, 679693',
    event_order:
      'Приличный фонарик полевой коммунизм. Инфекция бетонный нажать коммунизм командование обида степь.\n' +
      'Зима возмутиться пятеро домашний командир степь тяжелый. Оставить карман витрина процесс космос.',
    geo: '56.249564,18.496308',
    description:
      'Вот вам яркий пример современных тенденций — консультация с широким активом требует определения и уточнения экспериментов, поражающих по своей масштабности и грандиозности. Следует отметить, что внедрение современных методик однозначно фиксирует необходимость своевременного выполнения сверхзадачи. Как принято считать, предприниматели в сети интернет и по сей день остаются уделом либералов, которые жаждут быть смешаны с не уникальными данными до степени совершенной неузнаваемости, из-за чего возрастает их статус бесполезности. Ясность нашей позиции очевидна: укрепление и развитие внутренней структуры предопределяет высокую востребованность существующих финансовых и административных условий. Следует отметить, что базовый вектор развития в значительной степени обусловливает важность форм воздействия.',
    end_datetime: '2024-04-06T09:12:58.544903',
    id: 10000001,
    end_request_datetime: '2024-04-20T09:12:58.544900',
    organizer_id: 715,
    event_system: 'багровый',
    image_field: 'https://placekitten.com/976/755',
    sports_in_matches: ['Айкидо', 'Кайдо', 'Дзюдо'],
  },
  {
    name: 'Соревнование по арм рестлингу',
    start_datetime: '2024-02-20T09:12:58.545157',
    start_request_datetime: '2024-02-20T09:12:58.545157',
    location: 'п. Кажим, пер. Малиновый, д. 623, 162586',
    event_order:
      'Пропадать встать дрогнуть аж потянуться. Необычный зарплата чем райком желание естественный. Запеть наслаждение рота наткнуться предоставить.',
    geo: '-77.529661,75.594681',
    description:
      'Задача организации, в особенности же консультация с широким активом не оставляет шанса для переосмысления внешнеэкономических политик. В своём стремлении повысить качество жизни, они забывают, что дальнейшее развитие различных форм деятельности требует анализа новых предложений! Разнообразный и богатый опыт говорит нам, что дальнейшее развитие различных форм деятельности требует анализа своевременного выполнения сверхзадачи. Банальные, но неопровержимые выводы, а также стремящиеся вытеснить традиционное производство, нанотехнологии призваны к ответу.',
    end_datetime: '2024-02-29T09:12:58.545160',
    id: 10000002,
    end_request_datetime: '2024-02-20T09:12:58.545157',
    organizer_id: 1242,
    event_system: 'приятель',
    image_field: 'https://dummyimage.com/173x602',
    sports_in_matches: ['Айкидо', 'Вольная борьба', 'Каратэномичи'],
  },
  {
    name: 'Случайное событие 1',
    start_datetime: '2024-04-10T14:30:00.000Z',
    start_request_datetime: '2024-04-10T14:30:00.000Z',
    location: 'г. Москва, ул. Случайная, д. 123',
    event_order: 'Описание случайного события 1',
    geo: '55.7558, 37.6176',
    description:
      'Это случайное событие предоставляет уникальную возможность для участия и развлечения.',
    end_datetime: '2024-04-11T14:30:00.000Z',
    id: 10000003,
    end_request_datetime: '2024-04-11T14:30:00.000Z',
    organizer_id: 888,
    event_system: 'случайный',
    image_field: 'https://example.com/image1.jpg',
    sports_in_matches: ['Кудо', 'Каратэ'],
  },
  {
    name: 'Случайное событие 2',
    start_datetime: '2024-03-20T10:00:00.000Z',
    start_request_datetime: '2024-03-20T10:00:00.000Z',
    location: 'г. Санкт-Петербург, пр. Случайный, д. 456',
    event_order: 'Описание случайного события 2',
    geo: '59.9343, 30.3351',
    description:
      'Участвуйте в этом увлекательном событии и получите незабываемые впечатления!',
    end_datetime: '2024-03-21T10:00:00.000Z',
    id: 10000004,
    end_request_datetime: '2024-03-21T10:00:00.000Z',
    organizer_id: 999,
    event_system: 'случайный',
    image_field: 'https://example.com/image2.jpg',
    sports_in_matches: ['Кикбоксинг', 'Бокс'],
  },
  {
    name: 'Случайное событие 3',
    start_datetime: '2024-02-25T18:00:00.000Z',
    start_request_datetime: '2024-02-25T18:00:00.000Z',
    location: 'г. Новосибирск, ул. Случайная, д. 789',
    event_order: 'Описание случайного события 3',
    geo: '55.0084, 82.9357',
    description: 'Не упустите шанс стать участником этого интересного события!',
    end_datetime: '2024-02-26T18:00:00.000Z',
    id: 10000005,
    end_request_datetime: '2024-02-26T18:00:00.000Z',
    organizer_id: 777,
    event_system: 'случайный',
    image_field: 'https://example.com/image3.jpg',
    sports_in_matches: ['Самбо', 'Дзюдо'],
  },
  {
    name: 'Случайное событие 4',
    start_datetime: '2024-01-20T15:30:00.000Z',
    start_request_datetime: '2024-01-20T15:30:00.000Z',
    location: 'г. Екатеринбург, ул. Случайная, д. 1011',
    event_order: 'Описание случайного события 4',
    geo: '56.8389, 60.6057',
    description:
      'Присоединяйтесь к этому увлекательному событию и получите массу положительных эмоций!',
    end_datetime: '2024-01-21T15:30:00.000Z',
    id: 10000006,
    end_request_datetime: '2024-01-21T15:30:00.000Z',
    organizer_id: 555,
    event_system: 'случайный',
    image_field: 'https://example.com/image4.jpg',
    sports_in_matches: ['Айкидо', 'Кайдо', 'Каратэномичи'],
  },
  {
    name: 'Случайное событие 5',
    start_datetime: '2023-12-01T12:00:00.000Z',
    start_request_datetime: '2023-12-01T12:00:00.000Z',
    location: 'г. Краснодар, ул. Случайная, д. 1314',
    event_order: 'Описание случайного события 5',
    geo: '45.0355, 38.9753',
    description:
      'Примите участие в этом уникальном событии и получите незабываемые впечатления!',
    end_datetime: '2023-12-02T12:00:00.000Z',
    id: 10000007,
    end_request_datetime: '2023-12-02T12:00:00.000Z',
    organizer_id: 333,
    event_system: 'случайный',
    image_field: 'https://example.com/image5.jpg',
    sports_in_matches: ['Айкидо', 'Кайдо', 'Каратэномичи'],
  },
];

export const testTeam: TeamByIdFromServer = {
  Team: {
    id: 999999,
    name: 'Соболева Лтд',
    image_field: 'https://dummyimage.com/164x520',
    description: 'Грудь встать отдел опасность постоянный угодный страсть.',
    invite_link: 'ad1e7767-ee4c-4eaf-8f51-4f0e4dd687ad',
    slug: '',
    country: 3,
    city: 'ст. Кош-Агач',
    region: 18,
  },
  Captain: {
    user_id: 322,
  },
  Members: [
    {
      id: 322,
      sirname: 'Абрамова',
      name: 'Алефтина',
      fathername: 'Платоновна',
      birthdate: '2011-09-27',
      gender: false,
      height: 187,
      weight: 128.0,
      image_field: 'https://picsum.photos/993/340',
      country: 3,
      region: 12,
      city: 'клх Тобольск',
      sport_types: ['Самбо', 'Греко-римская борьба'],
      grade_types: ['МС', 'ЗМС', '3-й спортивный разряд'],
      coaches: [
        {
          sirname: 'Шарапова',
          name: 'Ладимир',
          fathername: 'Лариса',
          qualification_level: 1,
        },
        {
          sirname: 'Меркушев',
          name: 'Ферапонт',
          fathername: 'Ян',
          qualification_level: 2,
        },
      ],
    },
    {
      id: 10000,
      sirname: 'Парамонов',
      name: 'Сергей',
      fathername: 'Италианович',
      birthdate: '1995-09-27',
      gender: true,
      height: 187,
      weight: 98.0,
      image_field: 'https://picsum.photos/993/222',
      country: 1,
      region: 1,
      city: 'Химки',
      sport_types: ['Самбо', 'Айкидо', 'Бокс'],
      grade_types: ['МС', 'ЗМС', '1-й спортивный разряд'],
      coaches: [
        {
          sirname: 'Шарапова',
          name: 'Ладимир',
          fathername: 'Лариса',
          qualification_level: 1,
        },
        {
          sirname: 'Меркушев',
          name: 'Ферапонт',
          fathername: 'Ян',
          qualification_level: 2,
        },
        {
          sirname: 'Фалалеев',
          name: 'Дмитрий',
          fathername: 'Сергеевич',
          qualification_level: 1,
        },
      ],
    },
    {
      id: 10001,
      sirname: 'Филимонов',
      name: 'Анатолий',
      fathername: 'Валерианович',
      birthdate: '1995-01-27',
      gender: true,
      height: 185,
      weight: 81.0,
      image_field: 'https://picsum.photos/993/221',
      country: 1,
      region: 10,
      city: 'Бокситогорск',
      sport_types: ['Тхэквондо', 'Айкидо', 'Кайдо'],
      grade_types: ['МС', 'ЗМС'],
      coaches: [
        {
          sirname: 'Басов',
          name: 'Ладимир',
          fathername: 'Баристович',
          qualification_level: 1,
        },
        {
          sirname: 'Меркушева',
          name: 'Филия',
          fathername: 'Яновна',
          qualification_level: 2,
        },
        {
          sirname: 'Фалалеев',
          name: 'Дмитрий',
          fathername: 'Сергеевич',
          qualification_level: 1,
        },
      ],
    },
    {
      id: 450,
      sirname: 'Иванова',
      name: 'Екатерина',
      fathername: 'Александровна',
      birthdate: '2003-03-15',
      gender: false,
      height: 172,
      weight: 60.5,
      image_field: 'https://picsum.photos/993/345',
      country: 2,
      region: 5,
      city: 'Москва',
      sport_types: ['Теннис', 'Баскетбол'],
      grade_types: ['МС'],
      coaches: [
        {
          sirname: 'Смирнов',
          name: 'Владимир',
          fathername: 'Игоревич',
          qualification_level: 3,
        },
        {
          sirname: 'Петрова',
          name: 'Мария',
          fathername: 'Викторовна',
          qualification_level: 2,
        },
      ],
    },
    {
      id: 678,
      sirname: 'Кузнецов',
      name: 'Алексей',
      fathername: 'Борисович',
      birthdate: '1998-07-21',
      gender: true,
      height: 180,
      weight: 75.0,
      image_field: 'https://picsum.photos/993/346',
      country: 3,
      region: 8,
      city: 'Новосибирск',
      sport_types: ['Волейбол', 'Легкая атлетика'],
      grade_types: ['МС', 'ЗМС', '2-й спортивный разряд'],
      coaches: [
        {
          sirname: 'Иванов',
          name: 'Сергей',
          fathername: 'Николаевич',
          qualification_level: 1,
        },
        {
          sirname: 'Алексеева',
          name: 'Ольга',
          fathername: 'Петровна',
          qualification_level: 2,
        },
      ],
    },
    {
      id: 893,
      sirname: 'Сидоров',
      name: 'Дмитрий',
      fathername: 'Евгеньевич',
      birthdate: '2000-05-18',
      gender: true,
      height: 190,
      weight: 85.0,
      image_field: 'https://picsum.photos/993/347',
      country: 1,
      region: 3,
      city: 'Санкт-Петербург',
      sport_types: ['Футбол', 'Тяжелая атлетика'],
      grade_types: ['МС', '2-й спортивный разряд'],
      coaches: [
        {
          sirname: 'Кузнецова',
          name: 'Анна',
          fathername: 'Васильевна',
          qualification_level: 1,
        },
        {
          sirname: 'Павлов',
          name: 'Артем',
          fathername: 'Дмитриевич',
          qualification_level: 3,
        },
      ],
    },
    {
      id: 1501,
      sirname: 'Зайцева',
      name: 'Марина',
      fathername: 'Николаевна',
      birthdate: '2012-01-09',
      gender: false,
      height: 160,
      weight: 52.0,
      image_field: 'https://picsum.photos/993/348',
      country: 2,
      region: 10,
      city: 'Екатеринбург',
      sport_types: ['Гимнастика', 'Плавание'],
      grade_types: ['МС', 'ЗМС', '3-й спортивный разряд'],
      coaches: [
        {
          sirname: 'Попов',
          name: 'Андрей',
          fathername: 'Иванович',
          qualification_level: 2,
        },
        {
          sirname: 'Беляева',
          name: 'Елена',
          fathername: 'Сергеевна',
          qualification_level: 3,
        },
      ],
    },
    {
      id: 2102,
      sirname: 'Волков',
      name: 'Николай',
      fathername: 'Владимирович',
      birthdate: '1993-11-05',
      gender: true,
      height: 185,
      weight: 55.0,
      image_field: 'https://picsum.photos/993/349',
      country: 1,
      region: 7,
      city: 'Казань',
      sport_types: ['Хоккей', 'Бокс'],
      grade_types: ['KМС'],
      coaches: [
        {
          sirname: 'Соловьев',
          name: 'Виктор',
          fathername: 'Алексеевич',
          qualification_level: 1,
        },
        {
          sirname: 'Федорова',
          name: 'Наталья',
          fathername: 'Михайловна',
          qualification_level: 2,
        },
      ],
    },
    {
      id: 21021212,
      sirname: 'Палкин',
      name: 'Парфён',
      fathername: 'Владимирович',
      birthdate: '1990-11-05',
      gender: true,
      height: 185,
      weight: 57.0,
      image_field: 'https://picsum.photos/993/351',
      country: 1,
      region: 7,
      city: 'Казань',
      sport_types: ['Хоккей', 'Бокс'],
      grade_types: ['МС', 'ЗМС', '3-й спортивный разряд'],
      coaches: [
        {
          sirname: 'Соловьев',
          name: 'Виктор',
          fathername: 'Алексеевич',
          qualification_level: 1,
        },
        {
          sirname: 'Федорова',
          name: 'Наталья',
          fathername: 'Михайловна',
          qualification_level: 2,
        },
      ],
    },
  ],
};
