'use client';

import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { revalidateUserTeams } from '@/lib/actions';
import { getSession } from '@/lib/actions/auth';
import { fetchAthleteTeams, joinTeam } from '@/lib/data';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface TeamActionButtonsProps {
  teamId: string;
  teamName: string;
  captainId: number;
}

export function TeamActionButtons({
  teamId,
  teamName,
  captainId,
}: TeamActionButtonsProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUserInTeam, setIsUserInTeam] = useState<boolean>(false);
  const [isUserCaptain, setIsUserCaptain] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');
  const [userId, setUserId] = useState<string | number>('');

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    if (token && userId) {
      getUsersTeamData();
      userInfo();
    }
  }, [token, userId]);

  const loadSession = async () => {
    const session = await getSession();
    if (session) {
      setToken(session.token);
      setUserId(session.user[0].user_id);
    }
  };

  const userInfo = async () => {
    if (userId === captainId) {
      setIsUserCaptain(true);
    }
  };

  const submitJoinTeam = async () => {
    setIsLoading(true);
    joinTeam(token, teamId)
      .then(() => {
        toast.success(`Поздравляем! Вы вступили в команду - ${teamName}`);
        return getUsersTeamData();
      })
      .then(() => revalidateUserTeams())
      .catch((err) => {
        console.log('Ошибка при добавлении в команду: ', err);
        toast.error('Что-то пошло не так');
      });
  };

  const getUsersTeamData = async () => {
    setIsLoading(true);
    fetchAthleteTeams(token)
      .then((athleteTeams) => {
        if (athleteTeams) {
          const isInTeam = athleteTeams.find(
            (team) => team.team_id === +teamId,
          );
          setIsUserInTeam(!!isInTeam);
        }
      })
      .catch((err) => {
        console.log('Ошибка при получении данных: ', err);
        toast.error('Не удалось загрузить данные');
      })
      .finally(() => setIsLoading(false));
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
          disabled={isLoading}
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
