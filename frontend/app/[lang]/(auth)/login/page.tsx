import { Greetings } from '../../../../components/greetings';
import { Locale } from '@/i18n.config';
import { LoginForm } from './login-form';

export default function Login({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  return (
    <>
      <Greetings
        title="Привет!"
        subtitle="Добро пожаловать в Личный кабинет РуЧамп!"
      />
      <LoginForm lang={lang} />
    </>
  );
}
