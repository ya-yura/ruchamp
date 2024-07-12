'use client';

import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { getSession } from '@/lib/actions/auth';
import { fetchAthleteTeams, joinTeam } from '@/lib/data';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface TeamActionButtonsProps {
  id: string;
  teamName: string;
  captainId: number;
}

export function TeamActionButtons({
  id,
  teamName,
  captainId,
}: TeamActionButtonsProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUserInTeam, setIsUserInTeam] = useState<boolean>(false);
  const [isUserCaptain, setIsUserCaptain] = useState<boolean>(false);

  useEffect(() => {
    getUsersTeamData();
  }, []);

  useEffect(() => {
    userInfo();
  }, [isUserCaptain]);

  const userInfo = async () => {
    const session = await getSession();
    const userId = session?.user[0].user_id;
    if (userId === captainId) {
      setIsUserCaptain(true);
    }
  };

  const submitJoinTeam = async () => {
    setIsLoading(true);
    const session = await getSession();
    const token = session?.token;
    if (token) {
      joinTeam(token, id)
        .then(() => {
          toast.success(`Поздравляем! Вы вступили в команду - ${teamName}`);
          return getUsersTeamData();
        })
        .catch((err) => {
          console.log('Ошибка при добавлении в команду: ', err);
          toast.error('Что-то пошло не так');
        });
    }
  };

  const getUsersTeamData = async () => {
    setIsLoading(true);
    const session = await getSession();
    const token = session?.token;
    if (token) {
      fetchAthleteTeams(token)
        .then((athleteTeams) => {
          if (athleteTeams) {
            const isInTeam = athleteTeams.find((team) => team.team_id === +id);
            setIsUserInTeam(!!isInTeam);
          }
        })
        .catch((err) => {
          console.log('Ошибка при получении данных: ', err);
          toast.error('Не удалось загрузить данные');
        })
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <div className="mb-[87px] flex gap-6">
      {isUserInTeam ? (
        <Button variant="transparentGreen">
          {isLoading && <Spinner className="h-6 w-6" />}
          &#10003; Вы в команде
        </Button>
      ) : (
        <Button
          variant="ruchampDefault"
          onClick={submitJoinTeam}
          disabled={isLoading ? true : false}
        >
          {isLoading && <Spinner className="h-6 w-6" />}
          Вступить
        </Button>
      )}

      {isUserCaptain ? (
        <Button variant="ruchampTransparent">Переназначить капитана</Button>
      ) : (
        ''
      )}
    </div>
  );
}
