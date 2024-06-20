export enum Country {
  'Россия' = 1,
  'Беларусь' = 2,
  'Казахстан' = 3,
}

export enum AllRegions {
  'Центральный федеральный округ' = 1,
  'Северо-Западный федеральный округ' = 2,
  'Южный федеральный округ' = 3,
  'Приволжский федеральный округ' = 4,
  'Уральский федеральный округ' = 5,
  'Сибирский федеральный округ' = 6,
  'Дальневосточный федеральный округ' = 7,
  'Брестская область' = 8,
  'Витебская область' = 9,
  'Гомельская область' = 10,
  'Гродненская область' = 11,
  'Минская область' = 12,
  'Могилевская область' = 13,
  'Акмолинская область' = 14,
  'Актюбинская область' = 15,
  'Алматинская область' = 16,
  'Атырауская область' = 17,
  'Восточно-Казахстанская область' = 18,
  'Жамбылская область' = 19,
  'Западно-Казахстанская область' = 20,
  'Карагандинская область' = 21,
  'Костанайская область' = 22,
  'Кызылординская область' = 23,
  'Мангистауская область' = 24,
  'Павлодарская область' = 25,
  'Северо-Казахстанская область' = 26,
  'Туркестанская область' = 27,
}

export enum RuRegions {
  'Центральный федеральный округ' = 1,
  'Северо-Западный федеральный округ' = 2,
  'Южный федеральный округ' = 3,
  'Приволжский федеральный округ' = 4,
  'Уральский федеральный округ' = 5,
  'Сибирский федеральный округ' = 6,
  'Дальневосточный федеральный округ' = 7,
}

export enum ByRegions {
  'Брестская область' = 8,
  'Витебская область' = 9,
  'Гомельская область' = 10,
  'Гродненская область' = 11,
  'Минская область' = 12,
  'Могилевская область' = 13,
}

export enum KzRegions {
  'Акмолинская область' = 14,
  'Актюбинская область' = 15,
  'Алматинская область' = 16,
  'Атырауская область' = 17,
  'Восточно-Казахстанская область' = 18,
  'Жамбылская область' = 19,
  'Западно-Казахстанская область' = 20,
  'Карагандинская область' = 21,
  'Костанайская область' = 22,
  'Кызылординская область' = 23,
  'Мангистауская область' = 24,
  'Павлодарская область' = 25,
  'Северо-Казахстанская область' = 26,
  'Туркестанская область' = 27,
}

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

interface ApplicationMember {
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

interface ApplicationTeam {
  id: number;
  name: string;
  members: ApplicationMember[];
}

export interface Applications {
  approved?: ApplicationTeam[];
  rejected?: ApplicationTeam[];
  paid?: ApplicationTeam[];
  accepted?: ApplicationTeam[];
}

// *** Teams ***

export enum TeamTabs {
  'info' = 'Информация',
  'athletes' = 'Спортсмены',
  'matches' = 'Мероприятия',
  'results' = 'Результаты',
}
