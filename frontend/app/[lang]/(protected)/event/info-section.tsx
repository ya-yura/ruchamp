import { Info } from './info';
import { Athletes } from './athletes';
import { Matches } from './matches';
import { Grid } from './grid';
import { Results } from './results';
import { makeStyles, tokens, shorthands } from '@fluentui/react-components';

const useStyles = makeStyles({
  section: {
    backgroundColor: tokens.colorNeutralBackground4,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    ...shorthands.padding('54px', '72px'),
  },
});

export function InfoSection({ selectedValue }: any) {
  const styles = useStyles();

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
