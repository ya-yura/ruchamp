import { Body1, Caption1, Card, CardFooter } from '@fluentui/react-components';
import Image from 'next/image';
import { makeStyles, tokens } from '@fluentui/react-components';

const useOverrides = makeStyles({
  card: { cursor: 'pointer' },
  title: { color: tokens.colorNeutralForeground4, fontWeight: '700' },
  text: { color: tokens.colorNeutralForeground4 },
  footer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    '& div': {
      display: 'flex',
      flexDirection: 'column',
      '& h6': {
        maxWidth: '200px',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflowX: 'hidden',
      },
    },
  },
});

export default function CustomCard({ title, date }: any) {
  const overrides = useOverrides();

  return (
    <Card className={overrides.card}>
      <Image
        src="/ru/images/event-image-example.png"
        alt={'ДОБАВИТЬ ОПИСАНИЕ'}
        width={246}
        height={170}
      />
      <CardFooter className={overrides.footer}>
        <Image
          src="/ru/images/icon-loop.png"
          alt={'ДОБАВИТЬ ОПИСАНИЕ'}
          width={24}
          height={24}
        />
        <div>
          <Body1 as="h6">
            <b>{title}</b>
          </Body1>
          <Caption1 as="p" className={overrides.text}>
            {date}
          </Caption1>
        </div>
      </CardFooter>
    </Card>
  );
}
