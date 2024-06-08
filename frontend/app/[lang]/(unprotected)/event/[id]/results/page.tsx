import { ContentWraper } from '@/components/content-wraper';
import { CustomSection } from '@/components/custom-section';
import { Results } from '@/components/results/results';
import { Locale } from '@/i18n.config';
import { fetchResults } from '@/lib/data';
import React, { Suspense } from 'react';
import Loading from './loading';

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
  const goldenMedalWinners = results.filter(
    (athlete) => athlete.medal === 'gold',
  );
  const silverMedalWinners = results.filter(
    (athlete) => athlete.medal === 'silver',
  );
  const bronzeMedalWinners = results.filter(
    (athlete) => athlete.medal === 'bronze',
  );

  return (
    <CustomSection className="relative mb-10">
      <ContentWraper className="relative">
        <Suspense fallback={<Loading />}>
          <Results
            athletes={results}
            goldenMedalWinners={goldenMedalWinners}
            silverMedalWinners={silverMedalWinners}
            bronzeMedalWinners={bronzeMedalWinners}
            isWithEvent={false}
            isWithResults={true}
          />
        </Suspense>
      </ContentWraper>
    </CustomSection>
  );
}
