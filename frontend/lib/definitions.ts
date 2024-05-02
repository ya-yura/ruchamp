import { ChangeEvent, Dispatch, FormEvent, SetStateAction } from 'react';

export type TypeHttpRequest = {
  baseUrl: string;
  headers: { 'Content-Type': string; Authorization: string };
};

export type TypeLinksDropdown = {
  name: string;
  url: string;
};

export type TypeUserRole = 1 | 2 | 3 | 4 | 5;

export type TypeFieldValues =
  | string
  | string[]
  | number
  | boolean
  | Date
  | TypeUserRole;

export type TypeFirstUserFields = {
  email: string;
  password: string;
  repeat_password: string;
  role_id: number;
};

export type TypeBasicUserFields = {
  name: string;
  sirname: string;
  fathername: string;
  username: string;
  gender: boolean;
  country: 'ru' | 'by' | 'kz';
  birthdate: string;
};

export type TypeSpectatorFields = {
  spectator_phone_number: string;
};

export type TypeAthleteFields = {
  athlete_weight: number;
  athlete_height: number;
  athlete_sport_type: string[];
};

export type TypeOrganizerFields = {
  event_organizer_organization_name: string;
  event_organizer_organization_website: string;
  event_organizer_organization_contact_email: string;
  event_organizer_organization_contact_phone: string;
};

export type TypeRefereeFields = {
  referee_qualification_level: number;
};

export type TypeOtherUserFields = {
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
};

export type TypeSpecialUserFields = TypeSpectatorFields &
  TypeAthleteFields &
  TypeOrganizerFields &
  TypeRefereeFields;

export type TypeRegisterFields = TypeFirstUserFields &
  TypeBasicUserFields &
  TypeSpecialUserFields;

//Check this type
export type TypeUser = Omit<TypeRegisterFields, 'password'> &
  TypeOtherUserFields & {
    id: number;
  };

export type TypeLoginFields = Omit<
  TypeFirstUserFields,
  'repeat_password' | 'role_id'
>;

export enum EnumUserRole {
  'athlete' = 1,
  'organizer' = 2,
  'spectator' = 3,
  // 'admin' = 4,
  'referee' = 5,
}

export type TypeUserRoles = {
  [key in keyof typeof EnumUserRole]: (typeof EnumUserRole)[key];
};

export enum EnumCountries {
  ru = 'Россия',
  by = 'Беларусь',
  kz = 'Казахстан',
}

// *** Events ***
export type TypeEvent = {
  name: string;
  start_datetime: string;
  location: string;
  event_order: string;
  geo: string;
  end_datetime: string;
  id: number;
  organizer_id: number;
  event_system: string;
  image_field: string;
};
