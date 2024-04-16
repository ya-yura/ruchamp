import { Greetings } from '../../../../components/greetings';
import { Locale } from '@/i18n.config';
import { ResetPasswordForm } from './reset-password-form';

export default function ResetPassword({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  return (
    <div className="relative flex h-full w-full">
      <Greetings
        title="Введите новый пароль"
        subtitle="Напечатайте новый пароль. Постарайтесь подобрать его посложнее. Он должен быть не короче 8 символов!"
      />
      <ResetPasswordForm lang={lang} />
    </div>
  );
}
