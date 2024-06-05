import React, { Suspense } from 'react';
import { Container } from '@/components/container';
import { TeamsListing } from './teams-listing';
import { Locale } from '@/i18n.config';
import { Country, AllRegions } from '@/lib/definitions';
import { getDictionary } from '@/lib/dictionary';
import { testTeamInTeams } from '@/lib/constants';
import { calculateGender } from '@/lib/utils/other-utils';
import { calculateAge } from '@/lib/utils/date-and-time';
import { defineDefaultRange, expandRange } from '@/lib/utils/math-utils';
import { fetchSportTypes, fetchTeams } from '@/lib/data';
import Loading from './loading';

interface TeamInfo {
  id: number;
  name: string;
  description: string;
  slug: string;
  invite_link: string;
  image_field: string;
  country: number;
  city: string;
  region: number;
}

interface CaptainInfo {
  sirname: string;
  name: string;
  fathername: string;
}

interface MemberPersonalInfo {
  sirname: string;
  name: string;
  fathername: string;
  birthdate: string;
  gender: boolean;
}

interface MemberAthleteInfo {
  height: number;
  weight: number;
  country: number;
  region: number;
  city: string;
}

interface MemberSportTypes extends Array<string> {}

type Gender = 'male' | 'female' | 'mixed' | '';

interface TeamMember {
  personalInfo: MemberPersonalInfo;
  athleteInfo: MemberAthleteInfo;
  sportTypes: string[];
}

export interface Team extends TeamInfo {
  captain: CaptainInfo;
  gender: Gender;
  weights: number[];
  ages: number[];
  location: string;
  sportTypes: string[];
}

export type TeamDataFromServer = [
  TeamInfo,
  CaptainInfo,
  [MemberPersonalInfo, MemberAthleteInfo, MemberSportTypes][],
];

export default async function Teams({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const { page } = await getDictionary(lang);
  const [teamData, sportTypes] = await Promise.all([
    fetchTeams(),
    fetchSportTypes(),
  ]);
  const dictionary = page.teams;

  let teams: Team[] = [];
  const weightRange = [250, 1];
  const ageRange = [100, 1];

  const transformTeamData = (team: TeamDataFromServer): Team => {
    const [teamInfo, captainInfo, members] = team;

    const sportTypes = Array.from(
      new Set(members.flatMap((member) => member[2])),
    );
    const gender = calculateGender(members.map((member) => member[0].gender));
    const weights = members
      .map((member) => member[1].weight)
      .sort((a, b) => a - b);
    const ages = members
      .map((member) => calculateAge(member[0].birthdate))
      .sort((a, b) => a - b);
    const location = `${teamInfo.city}, ${AllRegions[teamInfo.region]}, ${Country[teamInfo.country]}`;

    return {
      ...teamInfo,
      captain: captainInfo,
      sportTypes,
      gender,
      weights,
      ages,
      location,
    };
  };

  const updateRanges = (
    teams: Team[],
    range: number[],
    property: keyof Team,
  ) => {
    teams.forEach((team) => {
      const values = team[property] as number[];
      const minValue = Math.min(...values);
      const maxValue = Math.max(...values);
      range[0] = Math.min(range[0], minValue);
      range[1] = Math.max(range[1], maxValue);
    });
  };

  teams = [...teamData].map(transformTeamData); // remove spreading after tests
  updateRanges(teams, weightRange, 'weights');
  updateRanges(teams, ageRange, 'ages');

  const weightRangeWithExpad = expandRange(weightRange, 10);
  const ageRangeWithExpand = expandRange(ageRange, 5);
  const weightDefaults = defineDefaultRange(weightRangeWithExpad);
  const ageDefaults = defineDefaultRange(ageRangeWithExpand);

  return (
    <Container>
      <Suspense fallback={<Loading />}>
        <TeamsListing
          sportTypes={sportTypes}
          teams={teams}
          weightRange={weightRangeWithExpad}
          ageRange={ageRangeWithExpand}
          weightDefaults={weightDefaults}
          ageDefaults={ageDefaults}
          lang={lang}
          dictionary={dictionary}
        />
      </Suspense>
    </Container>
  );
}
