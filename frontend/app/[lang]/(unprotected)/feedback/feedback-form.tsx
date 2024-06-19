'use client';

import {
  CustomFieldset,
  TypeFieldsetData,
} from '@/components/forms/custom-fieldset';
import { CustomForm } from '@/components/forms/custom-form';
import { useEffect } from 'react';
import { Locale } from '@/i18n.config';
import { Form } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ButtonsBlock } from '@/components/auth/buttons-block';
import { CustomLink } from '@/components/custom-link';
import { useFormState } from 'react-dom';
import { sendFeedback } from '@/lib/actions/feedback';
import { SubmitActionButton } from '@/components/forms/submit-action-button';
import { toast } from 'sonner';
import { BackButton } from '@/components/back-button';

const formSchema = z.object({
  name: z.string(),
  email: z
    .string()
    .regex(
      /^[a-zA-Zа-яА-Я0-9_.+-]+@[a-zA-Zа-яА-Я0-9-]+\.[a-zA-Zа-яА-Я0-9-.]+$/,
    ),
  message: z.string().min(10, 'Минимальная длина 10 символов'),
});

const feedbackFieldset: TypeFieldsetData<z.infer<typeof formSchema>> = {
  fields: [
    {
      type: 'text',
      name: 'name',
      placeholder: 'Введите имя',
      label: 'Имя',
    },
    {
      type: 'email',
      name: 'email',
      placeholder: 'Ваша почта',
      label: 'Электронная почта',
    },
    {
      type: 'textarea',
      name: 'message',
      placeholder: 'Введите сообщение (минимум 10 символов)',
      label: 'Сообщение',
    },
  ],
};

export function FeedbackForm({ lang }: { lang: Locale }) {
  const [errorMessage, dispatch] = useFormState(sendFeedback, undefined);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    if (errorMessage === '200') {
      toast.success('Ваше сообщение отправлено');
    }
    if (errorMessage === '400') {
      toast.success(
        'Произошла ошибка, ваше сообщение не отправлено. Попробуйте повторить позже.',
      );
    }
  }, [errorMessage]);

  return (
    <Form {...form}>
      <CustomForm action={dispatch}>
        <CustomFieldset
          form={form}
          lang={lang}
          fieldsetData={feedbackFieldset}
          isFieldsetDisabled={errorMessage === '200'}
        />
        <ButtonsBlock>
          <CustomLink
            className="order-1 transition-opacity duration-300 hover:opacity-70 sm:-order-1"
            href={`/`}
            lang={lang}
          >
            <p className="text-xs">На главную</p>
          </CustomLink>
          {errorMessage === '200' ? (
            <BackButton variant={'ruchampDefault'} />
          ) : (
            <SubmitActionButton
              text={'Отправить'}
              isValid={form.formState.isValid}
            />
          )}
        </ButtonsBlock>
      </CustomForm>
    </Form>
  );
}
