export const Countries: Record<string, string> = {
  1: 'Россия',
  2: 'Беларусь',
  3: 'Казахстан',
};

export const AllRegions: Record<string, string> = {
  1: 'Центральный федеральный округ',
  2: 'Северо-Западный федеральный округ',
  3: 'Южный федеральный округ',
  4: 'Приволжский федеральный округ',
  5: 'Уральский федеральный округ',
  6: 'Сибирский федеральный округ',
  7: 'Дальневосточный федеральный округ',
  8: 'Брестская область',
  9: 'Витебская область',
  10: 'Гомельская область',
  11: 'Гродненская область',
  12: 'Минская область',
  13: 'Могилевская область',
  14: 'Акмолинская область',
  15: 'Актюбинская область',
  16: 'Алматинская область',
  17: 'Атырауская область',
  18: 'Восточно-Казахстанская область',
  19: 'Жамбылская область',
  20: 'Западно-Казахстанская область',
  21: 'Карагандинская область',
  22: 'Костанайская область',
  23: 'Кызылординская область',
  24: 'Мангистауская область',
  25: 'Павлодарская область',
  26: 'Северо-Казахстанская область',
  27: 'Туркестанская область',
};

export const RuRegions: Record<string, string> = {
  1: 'Центральный федеральный округ',
  2: 'Северо-Западный федеральный округ',
  3: 'Южный федеральный округ',
  4: 'Приволжский федеральный округ',
  5: 'Уральский федеральный округ',
  6: 'Сибирский федеральный округ',
  7: 'Дальневосточный федеральный округ',
};

export const ByRegions: Record<string, string> = {
  8: 'Брестская область',
  9: 'Витебская область',
  10: 'Гомельская область',
  11: 'Гродненская область',
  12: 'Минская область',
  13: 'Могилевская область',
};

export const KzRegions: Record<string, string> = {
  14: 'Акмолинская область',
  15: 'Актюбинская область',
  16: 'Алматинская область',
  17: 'Атырауская область',
  18: 'Восточно-Казахстанская область',
  19: 'Жамбылская область',
  20: 'Западно-Казахстанская область',
  21: 'Карагандинская область',
  22: 'Костанайская область',
  23: 'Кызылординская область',
  24: 'Мангистауская область',
  25: 'Павлодарская область',
  26: 'Северо-Казахстанская область',
  27: 'Туркестанская область',
};

export enum EnumUserRole {
  'athlete' = 1,
  'organizer' = 2,
  'spectator' = 3,
  // 'admin' = 4,
  'referee' = 5,
}

export type HttpRequest = {
  baseUrl: string;
  headers: { 'Content-Type': string; Authorization: string };
};

// User

export interface BasicInfo {
  id: number;
  username: string;
  email: string;
  sirname: string;
  name: string;
  fathername: string;
  birthdate: string;
  gender: boolean;
  role_id: number;
}

interface Achievements {
  gold: number;
  silver: number;
  bronze: number;
}

interface Grades {
  [key: string]: string;
}

export interface AchievementsRecord {
  [key: string]: Achievements;
}

interface AthleteInfo {
  id: number;
  user_id: number;
  weight: number;
  height: number;
  country: number;
  region: number;
  city: string;
  image_field: string | null;
  grades: Grades;
  sport_types: string[];
  coaches: string[];
  achievements: AchievementsRecord;
}

// export interface AthleteInfo {
//   id: number;
//   user_id: number;
//   weight: number;
//   height: number;
//   country: number;
//   region: number;
//   city: string;
//   image_field: string | null;
//   sport_types: string[];
//   coaches: string[];
//   grades: string[];
// }

export interface OrganizerInfo {
  id: number;
  user_id: number;
  website: string;
  contact_email: string;
  contact_phone: string;
  organization_name: string;
  description: string | null;
  image_field: string | null;
}

export type UserFromServer = [AthleteInfo & OrganizerInfo, BasicInfo];

export interface UserInfo {
  basicInfo: BasicInfo;
  roleInfo: AthleteInfo & OrganizerInfo;
}

export interface SessionData {
  user: UserFromServer;
  token: string;
  expires: string;
  iat: number;
  exp: number;
}

export interface AthleteMatch {
  match_id: number;
  event_id: number;
  event_name: string;
  location: string;
  org_name: string;
  name: string;
  sport_name: string;
  category_type: string;
  start_datetime: string;
  end_datetime: string;
  nominal_time: number;
  mat_vol: number;
  age_min: number;
  age_max: number;
  weight_category: string;
  weight_min: number;
  weight_max: number;
  gender: boolean;
  athlete_result: string;
}

interface Captain {
  sirname: string;
  name: string;
  fathername: string;
}

export interface TeamDetails {
  team_id: number;
  name: string;
  description: string;
  slug: string;
  invite_link: string;
  image_field: string;
  country: number;
  city: string;
  region: number;
  captain_id: number;
  captain: Captain;
}

// *** Events ***
export interface Event {
  name: string;
  start_datetime: string;
  start_request_datetime: string;
  location: string;
  event_order: string;
  geo: string | null;
  description: string;
  end_datetime: string;
  id: number;
  end_request_datetime: string;
  organizer_id: number;
  organizer_name: string;
  contact_phone: string;
  contact_email: string;
  website: string;
  image: string;
  event_system: string;
  image_field: string;
  sports_in_matches: string[];
}

export interface EventStatistics {
  total: {
    teams: number;
    teams_payed: number;
    tickets: number;
    sold_tickets_price: number;
    total_gain: number;
  };
  today: {
    teams: number;
    teams_payed: number;
    tickets: number;
    sold_tickets_price: number;
  };
}

export interface ApplicationMember {
  id: number;
  sirname: string;
  name: string;
  fathername: string;
  birthdate: string;
  gender: boolean;
  height: number;
  weight: number;
  image_field: string | null;
  country: number;
  region: number;
  city: string;
  grade_types: string[];
}

export interface ApplicationTeam {
  id: number;
  name: string;
  members: ApplicationMember[];
}

export interface Applications {
  approved?: ApplicationTeam[] | string;
  rejected?: ApplicationTeam[] | string;
  paid?: ApplicationTeam[] | string;
  accepted?: ApplicationTeam[] | string;
}

// *** Teams ***

export enum TeamTabs {
  'info' = 'Информация',
  'athletes' = 'Спортсмены',
  'matches' = 'Мероприятия',
  'results' = 'Результаты',
}
