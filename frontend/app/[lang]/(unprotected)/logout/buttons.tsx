'use client';

import { Button } from '@/components/ui/button';
import { logout } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useFormState } from 'react-dom';

export function LogoutButtons({ token }: { token: string }) {
  const [errorMessage, dispatch] = useFormState(logout, undefined);
  const router = useRouter();
  return (
    <form className="flex gap-5" action={dispatch}>
      <Button type="submit" size="lg" variant="ruchampDefault">
        Да
      </Button>
      <Button
        onClick={() => router.back()}
        size="lg"
        variant="ruchampTransparentGreyBorder"
        type="button"
      >
        Нет
      </Button>
    </form>
  );
}
