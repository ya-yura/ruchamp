import { ContentWraper } from '@/components/content-wraper';
import { CustomSection } from '@/components/custom-section';
import { Results } from '@/components/results/results';
import { Locale } from '@/i18n.config';
import { fetchResults } from '@/lib/data';
import React from 'react';

export interface EventResult {
  id: number;
  sirname: string;
  name: string;
  fathername: string;
  birthdate: string;
  gender: boolean;
  height: number;
  weight: number;
  image_field: string;
  country: number;
  region: number;
  city: string;
  medal: 'gold' | 'silver' | 'bronze' | 'none';
  points: number;
}

export default async function EventResultsPage({
  params,
}: {
  params: { id: string; lang: Locale };
}) {
  const { id, lang } = params;
  const results = await fetchResults(id);

  return (
    <CustomSection className="relative mb-10">
      <ContentWraper>
        <Results
          athletes={results}
          goldenMedalWinners={[]}
          silverMedalWinners={[]}
          bronzeMedalWinners={[]}
        />
      </ContentWraper>
    </CustomSection>
  );
}
