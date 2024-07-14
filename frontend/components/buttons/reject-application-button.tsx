import { toast } from 'sonner';
import { Button } from '../ui/button';
import { rejectAthleteApplication } from '@/lib/data';

interface ApplicationRejectButtonProps {
  token?: string;
  applicationId: number;
}

export function ApplicationRejectButton({
  token,
  applicationId,
}: ApplicationRejectButtonProps) {
  const handleClick = () => {
    rejectAthleteApplication(token, applicationId);
  };

  return (
    <Button onClick={handleClick} variant="ruchampDefault">
      Отозвать заявку
    </Button>
  );
}
