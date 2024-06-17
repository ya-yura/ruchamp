import { Greetings } from '@/components/greetings';
import { Locale } from '@/i18n.config';
import { FeedbackForm } from './feedback-form';
import { Container } from '@/components/container';

export default function ResetPassword({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  return (
    <div className="relative grid h-full w-full grid-cols-1 md:grid-cols-[3fr_5fr] lg:grid-cols-[1fr_1fr] sm:my-40">
      <Greetings
        title="Форма обратной связи"
        subtitle="Если у вас появились вопросы, предложения или замечания, то заполните форму обратной связи."
      />
      <FeedbackForm lang={lang} />
    </div>
  );
}
