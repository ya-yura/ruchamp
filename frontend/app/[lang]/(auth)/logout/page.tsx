import { Title1 } from '@fluentui/react-components';
import { LogoutButtons } from './buttons';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export default async function LogoutPage() {
  // const session = await getServerSession(authOptions);
  // const token = session?.user?.name as string;

  return (
    <div className="relative mx-auto flex min-h-[50vh] w-80 flex-col items-center justify-center gap-12">
      <Title1 align="center">Уверены, что хотите выйти?</Title1>
      <LogoutButtons />
    </div>
  );
}
