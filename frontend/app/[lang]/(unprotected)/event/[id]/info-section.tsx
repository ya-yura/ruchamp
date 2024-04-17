import { Info } from './info';
import { Athletes } from './athletes';
import { Matches } from './matches';
import { Grid } from './grid';
import { Results } from './results';
import { ContentWraper } from '../../../../../components/content-wraper';
import { TypeEvent } from '@/lib/definitions';

interface InfoSectionProps {
  event: TypeEvent;
  selectedValue: any;
  // fix "any" type
}

export function InfoSection({ selectedValue, event }: InfoSectionProps) {
  return (
    <section className="flex w-full flex-col px-[72px] pt-[54px]">
      <ContentWraper>
        {selectedValue === 'info' && <Info event={event} />}
        {selectedValue === 'athletes' && <Athletes />}
        {selectedValue === 'matches' && <Matches />}
        {selectedValue === 'grid' && <Grid />}
        {selectedValue === 'results' && <Results />}
      </ContentWraper>
    </section>
  );
}
