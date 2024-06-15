import { getSession } from '@/lib/actions/auth';
import { EnumUserRole, UserInfo } from '@/lib/definitions';
import { H4 } from '@/components/text';
import { Container } from '@/components/container';
import { ContentWraper } from '@/components/content-wraper';
import Image from 'next/image';

export default async function ProtectedOrgLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const user: UserInfo | null = session
    ? {
        basicInfo: session.user[1],
        roleInfo: session.user[0],
      }
    : null;
  const isOrg = user?.basicInfo.role_id === EnumUserRole['organizer'];

  if (!isOrg) {
    return (
      <Container>
        <ContentWraper>
          <H4 className="mx-auto mt-5">Вы не являетесь организатором</H4>
        </ContentWraper>
      </Container>
    );
  }

  return (
    <>
      <div className="absolute mt-[-92px] h-[853px] w-full ">
        <Image
          className="opacity-40"
          src="/ru/images/background-events.jpeg"
          alt=""
          fill={true}
          style={{ objectFit: 'cover' }}
        />
        <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full bg-gradient-to-b from-[rgba(0,0,0,0.01)] from-50% to-primary-background to-100%"></div>
      </div>
      {children}
    </>
  );
}
