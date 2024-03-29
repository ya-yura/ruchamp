import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  main: {
    backgroundColor: tokens.colorNeutralBackground4,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'calc(100vh-137px)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: '12px',
  },
});

export function Container({ children }: { children: React.ReactNode }) {
  const styles = useStyles();

  return <main className={styles.main}>{children}</main>;
}
