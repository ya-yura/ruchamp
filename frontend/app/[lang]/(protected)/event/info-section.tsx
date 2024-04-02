import { Info } from './info';
import { Athletes } from './athletes';
import { Matches } from './matches';
import { Grid } from './grid';
import { Results } from './results';

export function InfoSection({ selectedValue }: any) {
  return (
    <section className="flex w-full flex-col px-[72px] pb-[38px] pt-[54px]">
      {selectedValue === 'info' && <Info />}
      {selectedValue === 'athletes' && <Athletes />}
      {selectedValue === 'matches' && <Matches />}
      {selectedValue === 'grid' && <Grid />}
      {selectedValue === 'results' && <Results />}
    </section>
  );
}
