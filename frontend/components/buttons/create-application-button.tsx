import { toast } from 'sonner';
import { Button } from '../ui/button';
import { createApplication } from '@/lib/data';

interface ApplicationCreateButtonProps {
  token?: string;
  matchId: number;
}

export function ApplicationCreateButton({
  token,
  matchId,
}: ApplicationCreateButtonProps) {
  const handleClick = async () => {
    try {
      await createApplication(token, matchId);
      toast.success('Заявка успешно создана!');
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Неизвестная ошибка при создании заявки');
      }
    }
  };

  return (
    <div>
      <Button onClick={handleClick} variant="ruchampTransparent">
        Участвовать
      </Button>
    </div>
  );
}
