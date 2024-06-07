import { AthletesCardsWithFilters } from '@/components/cards/athletes-cards-with-filters';
import { Locale } from '@/i18n.config';
import { fetchParticipants } from '@/lib/data';
import { calculateAge } from '@/lib/utils/date-and-time';
import {
  createFilter,
  genderOptions,
  rangesFromArray,
} from '@/lib/utils/filters';
import React from 'react';
import { FilterData, TeamMember, ValueOption } from '../../../team/[id]/page';
import { CustomSection } from '@/components/custom-section';
import { ContentWraper } from '@/components/content-wraper';

export interface Participant
  extends Omit<
    TeamMember,
    'sport_types' | 'grade_types' | 'coaches' | 'height' | 'id'
  > {
  user_id: number;
  team: string;
  grade: string;
}

export default async function EventParticipantsPage({
  params,
}: {
  params: { id: string; lang: Locale };
}) {
  const { id, lang } = params;
  const participants = await fetchParticipants(id);
  const weights = participants
    .map((participant) => participant.weight)
    .sort((a, b) => +a - +b);
  const ages = participants
    .map((participant) => calculateAge(participant.birthdate))
    .sort((a, b) => +a - +b);

  const gradesOptions = getGradesOptions();
  const weightOptions = rangesFromArray(weights, 5);
  const ageOptions = rangesFromArray(ages, 5);
  const genderFilterData = createFilter('genders', 'Пол', genderOptions);
  const weightFilterData = createFilter('weights', 'Вес, кг', weightOptions);
  const gradeFilterData = createFilter('grades', 'Уровень', gradesOptions);
  const ageFilterData = createFilter('ages', 'Возраст, лет', ageOptions);
  const filtersData: FilterData[] = [
    genderFilterData,
    weightFilterData,
    gradeFilterData,
    ageFilterData,
  ];

  function getGradesOptions(): ValueOption[] {
    const participantGrades = [
      ...new Set(
        participants.flatMap((participant: Participant) => participant.grade),
      ),
    ].sort();
    return participantGrades.map((grade) => ({
      value: grade as string,
      displayedValue: grade as string,
    }));
  }

  return (
    <CustomSection className="relative mb-10">
      <ContentWraper>
        <AthletesCardsWithFilters
          athletes={participants}
          filtersData={filtersData}
          lang={lang}
        />
      </ContentWraper>
    </CustomSection>
  );
}
