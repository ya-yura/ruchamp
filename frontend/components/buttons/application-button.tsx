import { Button } from '../ui/button';
import { createApplication } from '@/lib/data';

interface ApplicationButtonProps {
  token?: string;
  matchId: number;
}

export function ApplicationButton({ token, matchId }: ApplicationButtonProps) {
  const handleClick = () => {
    createApplication(token, matchId);
  };

  return (
    <Button onClick={handleClick} variant="ruchampTransparent">
      Участвовать
    </Button>
  );
}
