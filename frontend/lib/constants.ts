import {
  TeamByIdFromServer,
  TeamMatch,
  TeamMemberWithResults,
} from '@/app/[lang]/(unprotected)/team/[id]/page';
import { Event } from './definitions';
import { TeamDataFromServer } from '@/app/[lang]/(unprotected)/teams/page';

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
    organizer_name: 'Министерство Спорта Республики Шкид',
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
    organizer_name: 'Министерство Культуры по спорту',
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
    organizer_name: 'Клуб по интересам',
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
    organizer_name: 'Самбо клуб',
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
    organizer_name: 'Министерство Спорта Республики Шкид',
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
    organizer_name: 'Невероятный организатор',
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
    organizer_name: 'Самай лучший организатор',
    event_system: 'случайный',
    image_field: 'https://example.com/image5.jpg',
    sports_in_matches: ['Айкидо', 'Кайдо', 'Каратэномичи'],
  },
];

export const testTeamInTeams: TeamDataFromServer = [
  {
    id: 0,
    name: 'Тестовая команда',
    description:
      'Описание тестовой команды: четко увеличиваться эффект пропадать зато.',
    slug: '',
    invite_link: '2b806bdf-49b3-48c3-ba17-dee2637294ed',
    image_field: 'https://picsum.photos/374/586',
    country: 1,
    city: 'г. Ноглики',
    region: 8,
  },
  {
    sirname: 'Наумова',
    name: 'Филипп',
    fathername: 'Федор',
  },
  [
    [
      {
        sirname: 'Наумова',
        name: 'Филипп',
        fathername: 'Федор',
        birthdate: '2020-11-10',
        gender: true,
      },
      {
        height: 132,
        weight: 127.0,
        country: 3,
        region: 17,
        city: 'д. Ессентуки',
      },
      [
        'Самбо',
        'Спортивный ножевой бой',
        'Практическая стрельба',
        'Спортивное метание ножа',
      ],
    ],
  ],
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

export const testMatches: TeamMatch[] = [
  {
    match_id: 4,
    event_id: 2,
    name: 'Сезон погода страна рецепт статья.',
    location: 'г. Москва, ул. Красная Пресня, д. 12, 123456',
    org_name: '234',
    sport_type: 'Бокс',
    grade: '2-й взрослый разряд',
    start_datetime: '2024-06-15T14:00:00.000000',
    end_datetime: '2024-06-15T14:30:00.000000',
    nominal_time: 1800,
    mat_vol: 3,
    age_min: 18,
    age_max: 35,
    weight_class: 'Средний',
  },
  {
    match_id: 51,
    event_id: 2,
    name: 'Сезон погода страна рецепт статья.',
    location: 'г. Москва, ул. Красная Пресня, д. 12, 123456',
    org_name: '234',
    sport_type: 'Кикбоксинг',
    grade: '3-й взрослый разряд',
    start_datetime: '2024-06-15T16:00:00.000000',
    end_datetime: '2024-06-15T17:30:00.000000',
    nominal_time: 1800,
    mat_vol: 3,
    age_min: 18,
    age_max: 35,
    weight_class: 'Средний',
  },
  {
    match_id: 52,
    event_id: 2,
    name: 'Сезон погода страна рецепт статья.',
    location: 'г. Москва, ул. Красная Пресня, д. 12, 123456',
    org_name: '234',
    sport_type: 'Бокс',
    grade: '2-й взрослый разряд',
    start_datetime: '2024-06-15T17:00:00.000000',
    end_datetime: '2024-06-15T18:30:00.000000',
    nominal_time: 1800,
    mat_vol: 3,
    age_min: 18,
    age_max: 35,
    weight_class: 'Легчайший',
  },
  {
    match_id: 5,
    event_id: 3,
    name: 'Команда праздник музей регион число.',
    location: 'г. Санкт-Петербург, наб. Фонтанки, д. 45, 190000',
    org_name: '345',
    sport_type: 'Карате',
    grade: '3-й юношеский разряд',
    start_datetime: '2024-07-10T09:00:00.000000',
    end_datetime: '2024-07-10T09:45:00.000000',
    nominal_time: 2700,
    mat_vol: 5,
    age_min: 12,
    age_max: 20,
    weight_class: 'Легкий',
  },
  {
    match_id: 6,
    event_id: 4,
    name: 'Событие культура студент проект улица.',
    location: 'г. Казань, ул. Баумана, д. 3, 420111',
    org_name: '456',
    sport_type: 'Самбо',
    grade: 'Кандидат в мастера спорта',
    start_datetime: '2024-08-05T11:15:00.000000',
    end_datetime: '2024-08-05T12:00:00.000000',
    nominal_time: 2700,
    mat_vol: 2,
    age_min: 20,
    age_max: 40,
    weight_class: 'Полусредний',
  },
  {
    match_id: 7,
    event_id: 5,
    name: 'Планета музей облако успех место.',
    location: 'г. Новосибирск, ул. Дуси Ковальчук, д. 1, 630000',
    org_name: '567',
    sport_type: 'Тхэквондо',
    grade: 'Мастер спорта',
    start_datetime: '2024-09-01T13:00:00.000000',
    end_datetime: '2024-09-01T13:20:00.000000',
    nominal_time: 1200,
    mat_vol: 6,
    age_min: 16,
    age_max: 35,
    weight_class: 'Легчайший',
  },
  {
    match_id: 60,
    event_id: 6,
    name: 'Премия ансамбль спортсмен город кино.',
    location: 'г. Екатеринбург, ул. Малышева, д. 8, 620000',
    org_name: '678',
    sport_type: 'Греко-римская борьба',
    grade: '1-й взрослый разряд',
    start_datetime: '2024-10-10T16:00:00.000000',
    end_datetime: '2024-10-10T16:30:00.000000',
    nominal_time: 1800,
    mat_vol: 1,
    age_min: 18,
    age_max: 40,
    weight_class: 'Полутяжелый',
  },
  {
    match_id: 61,
    event_id: 6,
    name: 'Премия ансамбль спортсмен город кино.',
    location: 'г. Екатеринбург, ул. Малышева, д. 8, 620000',
    org_name: '678',
    sport_type: 'Греко-римская борьба',
    grade: '2-й взрослый разряд',
    start_datetime: '2024-10-10T17:00:00.000000',
    end_datetime: '2024-10-10T17:30:00.000000',
    nominal_time: 1800,
    mat_vol: 1,
    age_min: 18,
    age_max: 40,
    weight_class: 'Тяжёлый',
  },
  {
    match_id: 62,
    event_id: 6,
    name: 'Премия ансамбль спортсмен город кино.',
    location: 'г. Екатеринбург, ул. Малышева, д. 8, 620000',
    org_name: '678',
    sport_type: 'Греко-римская борьба',
    grade: '3-й взрослый разряд',
    start_datetime: '2024-10-10T19:00:00.000000',
    end_datetime: '2024-10-10T20:30:00.000000',
    nominal_time: 1800,
    mat_vol: 1,
    age_min: 18,
    age_max: 40,
    weight_class: 'Полутяжелый',
  },
  {
    match_id: 9,
    event_id: 7,
    name: 'Кино спектакль проект корабль зима.',
    location: 'г. Владивосток, пр. Океанский, д. 22, 690000',
    org_name: '789',
    sport_type: 'Фехтование',
    grade: '2-й юношеский разряд',
    start_datetime: '2024-11-05T10:00:00.000000',
    end_datetime: '2024-11-05T10:20:00.000000',
    nominal_time: 1200,
    mat_vol: 3,
    age_min: 14,
    age_max: 25,
    weight_class: 'Полулегкий',
  },
  {
    match_id: 10,
    event_id: 8,
    name: 'Музыка танец команда путешествие знак.',
    location: 'г. Ростов-на-Дону, ул. Садовая, д. 36, 344000',
    org_name: '890',
    sport_type: 'Вольная борьба',
    grade: '3-й взрослый разряд',
    start_datetime: '2024-12-12T15:00:00.000000',
    end_datetime: '2024-12-12T15:30:00.000000',
    nominal_time: 1800,
    mat_vol: 2,
    age_min: 16,
    age_max: 35,
    weight_class: 'Средний',
  },
  {
    match_id: 11,
    event_id: 9,
    name: 'Образование природа роман праздник театр.',
    location: 'г. Красноярск, ул. Мира, д. 5, 660000',
    org_name: '901',
    sport_type: 'Дзюдо',
    grade: '1-й юношеский разряд',
    start_datetime: '2024-05-21T12:00:00.000000',
    end_datetime: '2024-05-21T12:15:00.000000',
    nominal_time: 900,
    mat_vol: 4,
    age_min: 15,
    age_max: 30,
    weight_class: 'Легкий',
  },
  {
    match_id: 12,
    event_id: 10,
    name: 'Мир океан победа художник здание.',
    location: 'г. Самара, ул. Ленинградская, д. 18, 443000',
    org_name: '012',
    sport_type: 'Айкидо',
    grade: 'Кандидат в мастера спорта',
    start_datetime: '2024-06-01T09:30:00.000000',
    end_datetime: '2024-06-01T10:00:00.000000',
    nominal_time: 1800,
    mat_vol: 1,
    age_min: 18,
    age_max: 40,
    weight_class: 'Тяжелый',
  },
  {
    match_id: 13,
    event_id: 11,
    name: 'Река ночь рисунок энергия идея.',
    location: 'г. Уфа, ул. Ленина, д. 4, 450000',
    org_name: '123',
    sport_type: 'Кикбоксинг',
    grade: 'Мастер спорта',
    start_datetime: '2024-07-20T11:00:00.000000',
    end_datetime: '2024-07-20T11:20:00.000000',
    nominal_time: 1200,
    mat_vol: 5,
    age_min: 20,
    age_max: 35,
    weight_class: 'Полутяжелый',
  },
];

export const testResults: TeamMemberWithResults[] = [
  {
    id: 499,
    sirname: 'Архипова',
    name: 'Полина',
    fathername: 'Поликарповна',
    birthdate: '1993-08-09',
    gender: true,
    height: 129,
    weight: 61.0,
    image_field: 'https://placekitten.com/1/694',
    country: 2,
    region: 22,
    city: 'г. Бугульма',
    matches_info: [
      {
        event_id: 798,
        event_name: 'Инвалид сравнение салон исполнять.',
        event_location: 'ст. Витим, ш. 60 лет Октября, д. 173 стр. 7/9, 016591',
        match_id: 1,
        match_name: 'Бой до первой крови',
        start_datetime: '2022-05-22T08:37:55.741267',
        sport_type: 'Самбо',
        medal_type: 'Серебро',
      },
      {
        event_id: 798,
        event_name: 'Инвалид сравнение салон исполнять.',
        event_location: 'ст. Витим, ш. 60 лет Октября, д. 173 стр. 7/9, 016591',
        match_id: 3,
        match_name: 'Бой до первой крови',
        start_datetime: '2022-05-22T08:37:55.741267',
        sport_type: 'Дзюдо',
        medal_type: 'Без медали',
      },
      {
        event_id: 800,
        event_name: 'Открытый кубок города по бойцовым видам спорта',
        event_location: 'г. Балашиха, ул. Пушкина, д. 41, 412512',
        match_id: 58,
        match_name: 'Бой до второй крови',
        start_datetime: '2022-06-25T08:37:55.741267',
        sport_type: 'Боевое Самбо',
        medal_type: 'Бронза',
      },
      {
        event_id: 921,
        event_name:
          'Закрытое соревнование на выявление среднего по уровню игрока',
        event_location: 'г. Приволжск, пр. Ленина, д. 51, 016563',
        match_id: 163,
        match_name: 'Бой до третьей крови',
        start_datetime: '2024-08-11T08:37:55.741267',
        sport_type: 'Дзюдо',
        medal_type: 'Бронза',
      },
    ],
    medals: {
      golden: 0,
      silver: 1,
      bronze: 2,
    },
    points: 21,
  },
  {
    id: 500,
    sirname: 'Иванов',
    name: 'Алексей',
    fathername: 'Викторович',
    birthdate: '1991-07-19',
    gender: true,
    height: 182,
    weight: 78.5,
    image_field: 'https://placekitten.com/2/694',
    country: 1,
    region: 10,
    city: 'г. Москва',
    matches_info: [
      {
        event_id: 801,
        event_name: 'Чемпионат России по дзюдо',
        event_location: 'г. Санкт-Петербург, ул. Ленина, д. 1',
        match_id: 45,
        match_name: 'Финальный бой',
        start_datetime: '2024-04-15T14:00:00.000Z',
        sport_type: 'Дзюдо',
        medal_type: 'Серебро',
      },
      {
        event_id: 802,
        event_name: 'Международный турнир по самбо',
        event_location: 'г. Казань, пр. Победы, д. 10',
        match_id: 102,
        match_name: 'Полуфинал',
        start_datetime: '2024-03-20T10:00:00.000Z',
        sport_type: 'Самбо',
        medal_type: 'Бронза',
      },
    ],
    medals: {
      golden: 0,
      silver: 1,
      bronze: 1,
    },
    points: 19,
  },
  {
    id: 501,
    sirname: 'Смирнова',
    name: 'Екатерина',
    fathername: 'Сергеевна',
    birthdate: '1995-12-01',
    gender: false,
    height: 165,
    weight: 55.0,
    image_field: 'https://placekitten.com/3/694',
    country: 1,
    region: 5,
    city: 'г. Новосибирск',
    matches_info: [
      {
        event_id: 803,
        event_name: 'Региональный турнир по боевому самбо',
        event_location: 'г. Омск, ул. Гагарина, д. 5',
        match_id: 78,
        match_name: 'Четвертьфинал',
        start_datetime: '2024-02-12T11:00:00.000Z',
        sport_type: 'Боевое Самбо',
        medal_type: 'Бронза',
      },
      {
        event_id: 804,
        event_name: 'Городской чемпионат по дзюдо',
        event_location: 'г. Красноярск, ул. Мира, д. 20',
        match_id: 88,
        match_name: 'Финал',
        start_datetime: '2024-01-25T12:00:00.000Z',
        sport_type: 'Дзюдо',
        medal_type: 'Золото',
      },
    ],
    medals: {
      golden: 1,
      silver: 0,
      bronze: 1,
    },
    points: 15,
  },
  {
    id: 502,
    sirname: 'Петров',
    name: 'Дмитрий',
    fathername: 'Алексеевич',
    birthdate: '1989-04-23',
    gender: true,
    height: 175,
    weight: 82.0,
    image_field: 'https://placekitten.com/4/694',
    country: 1,
    region: 47,
    city: 'г. Архангельск',
    matches_info: [
      {
        event_id: 805,
        event_name: 'Областной турнир по самбо',
        event_location: 'г. Сургут, ул. Комсомольская, д. 8',
        match_id: 31,
        match_name: 'Первый бой',
        start_datetime: '2024-03-05T09:00:00.000Z',
        sport_type: 'Самбо',
        medal_type: 'Бронза',
      },
      {
        event_id: 806,
        event_name: 'Республиканский чемпионат по дзюдо',
        event_location: 'г. Уфа, ул. Октября, д. 12',
        match_id: 41,
        match_name: 'Финальный бой',
        start_datetime: '2024-05-10T15:00:00.000Z',
        sport_type: 'Дзюдо',
        medal_type: 'Золото',
      },
    ],
    medals: {
      golden: 1,
      silver: 0,
      bronze: 1,
    },
    points: 17,
  },
  {
    id: 503,
    sirname: 'Кузнецова',
    name: 'Анна',
    fathername: 'Ивановна',
    birthdate: '1990-11-11',
    gender: false,
    height: 168,
    weight: 58.0,
    image_field: 'https://placekitten.com/5/694',
    country: 1,
    region: 22,
    city: 'г. Воронеж',
    matches_info: [
      {
        event_id: 807,
        event_name: 'Международный турнир по боевому самбо',
        event_location: 'г. Нижний Новгород, пр. Героев, д. 7',
        match_id: 65,
        match_name: 'Полуфинал',
        start_datetime: '2024-06-20T13:00:00.000Z',
        sport_type: 'Боевое Самбо',
        medal_type: 'Серебро',
      },
      {
        event_id: 808,
        event_name: 'Городской чемпионат по дзюдо',
        event_location: 'г. Белгород, ул. Победы, д. 16',
        match_id: 92,
        match_name: 'Финал',
        start_datetime: '2024-07-15T14:00:00.000Z',
        sport_type: 'Дзюдо',
        medal_type: 'Золото',
      },
    ],
    medals: {
      golden: 1,
      silver: 1,
      bronze: 0,
    },
    points: 20,
  },
  {
    id: 504,
    sirname: 'Сидоров',
    name: 'Михаил',
    fathername: 'Петрович',
    birthdate: '1992-03-14',
    gender: true,
    height: 180,
    weight: 85.0,
    image_field: 'https://placekitten.com/6/694',
    country: 1,
    region: 66,
    city: 'г. Екатеринбург',
    matches_info: [
      {
        event_id: 809,
        event_name: 'Областной чемпионат по самбо',
        event_location: 'г. Челябинск, ул. Ленина, д. 3',
        match_id: 25,
        match_name: 'Первый бой',
        start_datetime: '2024-08-10T10:00:00.000Z',
        sport_type: 'Самбо',
        medal_type: 'Бронза',
      },
      {
        event_id: 810,
        event_name: 'Международный турнир по дзюдо',
        event_location: 'г. Пермь, ул. Гагарина, д. 19',
        match_id: 48,
        match_name: 'Финальный бой',
        start_datetime: '2024-09-12T11:00:00.000Z',
        sport_type: 'Дзюдо',
        medal_type: 'Серебро',
      },
    ],
    medals: {
      golden: 0,
      silver: 1,
      bronze: 1,
    },
    points: 14,
  },
  {
    id: 505,
    sirname: 'Волков',
    name: 'Игорь',
    fathername: 'Александрович',
    birthdate: '1988-02-18',
    gender: true,
    height: 170,
    weight: 77.0,
    image_field: 'https://placekitten.com/7/694',
    country: 1,
    region: 34,
    city: 'г. Волгоград',
    matches_info: [
      {
        event_id: 811,
        event_name: 'Городской турнир по самбо',
        event_location: 'г. Ростов-на-Дону, ул. Кирова, д. 12',
        match_id: 53,
        match_name: 'Первый бой',
        start_datetime: '2024-10-15T09:00:00.000Z',
        sport_type: 'Самбо',
        medal_type: 'Без медали',
      },
      {
        event_id: 812,
        event_name: 'Региональный чемпионат по дзюдо',
        event_location: 'г. Краснодар, ул. Ленина, д. 10',
        match_id: 66,
        match_name: 'Финальный бой',
        start_datetime: '2024-11-20T14:00:00.000Z',
        sport_type: 'Дзюдо',
        medal_type: 'Золото',
      },
    ],
    medals: {
      golden: 1,
      silver: 0,
      bronze: 0,
    },
    points: 16,
  },
  {
    id: 506,
    sirname: 'Киселев',
    name: 'Василий',
    fathername: 'Николаевич',
    birthdate: '1996-09-29',
    gender: true,
    height: 172,
    weight: 70.0,
    image_field: 'https://placekitten.com/8/694',
    country: 1,
    region: 76,
    city: 'г. Ярославль',
    matches_info: [
      {
        event_id: 813,
        event_name: 'Республиканский турнир по самбо',
        event_location: 'г. Иваново, ул. Дзержинского, д. 14',
        match_id: 70,
        match_name: 'Первый бой',
        start_datetime: '2024-12-05T11:00:00.000Z',
        sport_type: 'Самбо',
        medal_type: 'Бронза',
      },
      {
        event_id: 814,
        event_name: 'Международный чемпионат по дзюдо',
        event_location: 'г. Тверь, ул. Советская, д. 9',
        match_id: 81,
        match_name: 'Финальный бой',
        start_datetime: '2025-01-12T13:00:00.000Z',
        sport_type: 'Дзюдо',
        medal_type: 'Серебро',
      },
    ],
    medals: {
      golden: 0,
      silver: 1,
      bronze: 1,
    },
    points: 12,
  },
  {
    id: 507,
    sirname: 'Громов',
    name: 'Сергей',
    fathername: 'Павлович',
    birthdate: '1994-06-10',
    gender: true,
    height: 178,
    weight: 83.0,
    image_field: 'https://placekitten.com/9/694',
    country: 1,
    region: 61,
    city: 'г. Рязань',
    matches_info: [
      {
        event_id: 815,
        event_name: 'Городской турнир по боевому самбо',
        event_location: 'г. Смоленск, ул. Карла Маркса, д. 11',
        match_id: 89,
        match_name: 'Первый бой',
        start_datetime: '2025-02-20T12:00:00.000Z',
        sport_type: 'Боевое Самбо',
        medal_type: 'Без медали',
      },
      {
        event_id: 816,
        event_name: 'Региональный чемпионат по дзюдо',
        event_location: 'г. Брянск, ул. Ленина, д. 15',
        match_id: 98,
        match_name: 'Финальный бой',
        start_datetime: '2025-03-25T14:00:00.000Z',
        sport_type: 'Дзюдо',
        medal_type: 'Бронза',
      },
    ],
    medals: {
      golden: 0,
      silver: 0,
      bronze: 1,
    },
    points: 8,
  },
  {
    id: 508,
    sirname: 'Морозова',
    name: 'Елена',
    fathername: 'Дмитриевна',
    birthdate: '1997-01-15',
    gender: false,
    height: 160,
    weight: 53.0,
    image_field: 'https://placekitten.com/10/694',
    country: 1,
    region: 77,
    city: 'г. Москва',
    matches_info: [
      {
        event_id: 817,
        event_name: 'Международный турнир по самбо',
        event_location: 'г. Санкт-Петербург, ул. Пушкина, д. 17',
        match_id: 91,
        match_name: 'Первый бой',
        start_datetime: '2025-04-10T10:00:00.000Z',
        sport_type: 'Самбо',
        medal_type: 'Без медали',
      },
      {
        event_id: 818,
        event_name: 'Чемпионат России по дзюдо',
        event_location: 'г. Калининград, пр. Мира, д. 4',
        match_id: 105,
        match_name: 'Финальный бой',
        start_datetime: '2025-05-15T13:00:00.000Z',
        sport_type: 'Дзюдо',
        medal_type: 'Золото',
      },
    ],
    medals: {
      golden: 1,
      silver: 0,
      bronze: 0,
    },
    points: 18,
  },
  {
    id: 509,
    sirname: 'Зайцева',
    name: 'Ольга',
    fathername: 'Петровна',
    birthdate: '1990-05-20',
    gender: false,
    height: 162,
    weight: 56.0,
    image_field: 'https://placekitten.com/11/694',
    country: 1,
    region: 54,
    city: 'г. Новокузнецк',
    matches_info: [
      {
        event_id: 819,
        event_name: 'Региональный турнир по боевому самбо',
        event_location: 'г. Новосибирск, ул. Ленина, д. 8',
        match_id: 97,
        match_name: 'Первый бой',
        start_datetime: '2025-06-20T11:00:00.000Z',
        sport_type: 'Боевое Самбо',
        medal_type: 'Без медали',
      },
      {
        event_id: 820,
        event_name: 'Городской чемпионат по дзюдо',
        event_location: 'г. Томск, пр. Гагарина, д. 13',
        match_id: 110,
        match_name: 'Финальный бой',
        start_datetime: '2025-07-25T12:00:00.000Z',
        sport_type: 'Дзюдо',
        medal_type: 'Серебро',
      },
    ],
    medals: {
      golden: 0,
      silver: 1,
      bronze: 0,
    },
    points: 11,
  },
];
