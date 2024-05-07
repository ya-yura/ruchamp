import { Locale } from '@/i18n.config';
import { RegisterForm } from './register-form';

export default function Register({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  return <RegisterForm lang={lang} />;
}
