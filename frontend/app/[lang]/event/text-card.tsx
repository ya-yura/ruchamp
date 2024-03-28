import { Body1, Card, Subtitle1 } from '@fluentui/react-components';
import { makeStyles, tokens, shorthands } from '@fluentui/react-components';

type TypeCustomCardProps = {
  title?: string;
  text: string;
};

const useOverrides = makeStyles({
  card: {
    ...shorthands.padding('30px', '24px'),
    ...shorthands.borderRadius('8px'),
    '& h4': {
      lineHeight:'20px'
    },
    '& p': {
      color: tokens.colorNeutralForeground4,
      whiteSpace: 'pre-line',
    },
  },
});

export function TextCard({ title, text }: TypeCustomCardProps) {
  const overrides = useOverrides();

  return (
    <Card className={overrides.card}>
      {title && <Subtitle1 as="h4">{title}</Subtitle1>}
      <Body1 as="p">{text}</Body1>
    </Card>
  );
}
