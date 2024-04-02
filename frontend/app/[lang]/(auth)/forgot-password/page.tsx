import { Greetings } from '../../ui/greetings';
import { Locale } from '@/i18n.config';
import { ForgotPasswordForm } from './forgot-password-form';

export default function ForgotPassword({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  return (
    <div className="relative flex h-full w-full">
      <Greetings
        title="Восстановим пароль"
        subtitle="Ничего страшного, такое бывает. Сейчас всё исправим. Напомните свой адрес электронной почты."
      />
      <ForgotPasswordForm lang={lang} />
    </div>
  );
}
