import {
  FilterData,
  GroupedMatch,
  MedalWinner,
  TeamMatch,
  TeamMemberWithResults,
  ValueOption,
} from '@/app/[lang]/(unprotected)/team/[id]/page';
import { Event } from '../definitions';
import { transformDate } from './date-and-time';
import { roundToBase } from './math-utils';

// Utils for filtering

export function rangesFromArray(array: number[], step: number): ValueOption[] {
  let res: number[][] = [];
  array.forEach((i) => {
    const min = roundToBase(i, step, 'down');
    const max = roundToBase(i, step, 'up');
    let range: number[] = [];
    if (i === 0) {
      range = [0, 0];
    } else if (min === max) {
      range = [max - step, max];
    } else range = [min, max];
    const stringifyedRes = res.map((i) => JSON.stringify(i));
    const stringifyedRange = JSON.stringify(range);
    !stringifyedRes.includes(stringifyedRange) && res.push(range);
  });
  return res.map((i) => ({
    value: i,
    displayedValue: i[0] === 0 && i[1] === 0 ? 'не указан' : i.join(' – '),
  }));
}

export function createFilter(
  id: string,
  title: string,
  options: ValueOption[],
  type?: FilterData['type'],
): FilterData {
  return { id, title, options, type };
}

export const genderOptions: ValueOption[] = [
  {
    value: 'male',
    displayedValue: 'Мужской',
  },
  {
    value: 'female',
    displayedValue: 'Женский',
  },
];

// Utils for sorting

export function sortAndGroupMatches(matches: TeamMatch[]) {
  matches.sort((a, b) => {
    if (a.start_datetime < b.start_datetime) return -1;
    if (a.start_datetime > b.start_datetime) return 1;
    if (a.event_id < b.event_id) return -1;
    if (a.event_id > b.event_id) return 1;
    return 0;
  });

  const groupedMatches = matches.reduce<Record<number, GroupedMatch>>(
    (acc, match) => {
      if (!acc[match.event_id]) {
        acc[match.event_id] = {
          event_id: match.event_id,
          name: match.name,
          location: match.location,
          start_datetime: transformDate(match.start_datetime),
          matches: [],
        };
      }
      acc[match.event_id].matches.push(match);
      return acc;
    },
    {},
  );

  return Object.values(groupedMatches);
}

export function getAthletesByMedal(
  athletesArray: TeamMemberWithResults[],
  medal: 'Золото' | 'Серебро' | 'Бронза',
): MedalWinner[] {
  let res: MedalWinner[] = [];
  athletesArray.forEach((athlete) =>
    athlete.matches_info.forEach((match) => {
      if (match.medal_type === medal) {
        res.push({
          id: athlete.id,
          sirname: athlete.sirname,
          name: athlete.name,
          fathername: athlete.fathername,
          birthdate: athlete.birthdate,
          gender: athlete.gender,
          height: athlete.height,
          weight: athlete.weight,
          image_field: athlete.image_field,
          country: athlete.country,
          region: athlete.region,
          city: athlete.city,
          event_id: match.event_id,
          event_name: match.event_name,
          match_id: match.match_id,
          match_name: match.match_name,
          event_location: match.event_location,
          start_datetime: match.start_datetime,
          sport_type: match.sport_type,
        });
      }
    }),
  );
  return res;
}

export function sortedEventsByDate(events: Event[]) {
  return events.sort((a, b) => {
    const dateA = new Date(a.start_datetime);
    const dateB = new Date(b.start_datetime);
    return dateA.getTime() - dateB.getTime();
  });
}
