import { Locale } from '@/i18n.config';
import { RegisterForm } from './register-form';
import { fetchSportTypes } from '@/lib/data';

export default async function Register({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const sportTypes = await fetchSportTypes();
  return <RegisterForm lang={lang} sportTypes={sportTypes} />;
}
