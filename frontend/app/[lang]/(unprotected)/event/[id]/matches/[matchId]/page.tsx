import React from 'react';
import { Grid } from '../../grid';
import { initialGrid } from '@/lib/constants';
import { CustomSection } from '@/components/custom-section';
import { fetchTournamentGrid } from '@/lib/data';
import { Locale } from '@/i18n.config';
import { H4 } from '@/components/text';
import { BackButton } from '@/components/back-button';

export interface GridInfo {
  match_id: number;
  event_id: number;
  match_name: string;
  start_time: string;
  end_time: string;
  method: string;
  age_from: number;
  age_till: number;
  sport_name: string;
  weight_category: string;
  gender: boolean;
}

interface GridFightInfo {
  fight_id: number;
  mat_number: number;
  start_time: string;
}

export interface GridPlayer {
  player_id: number;
  first_name: string | null;
  last_name: string | null;
  birthdate: string | null;
  team_name: string | null;
  team_id: number;
  points: number;
}

export interface GridFight {
  fight_info: GridFightInfo;
  player_1: GridPlayer;
  player_2: GridPlayer;
}

export interface GridRound {
  name: string;
  fights: GridFight[];
}

export interface GridData {
  grid_info: GridInfo;
  rounds: GridRound[];
}

export default async function TournamentGrid({
  params,
}: {
  params: { id: string; matchId: string; lang: Locale };
}) {
  const { id, matchId, lang } = params;
  const tournamentGrid = await fetchTournamentGrid(matchId);

  if (!tournamentGrid || +id !== tournamentGrid.grid_info.event_id) {
    return (
      <CustomSection className="relative mb-10">
        <H4>
          Информация об этом мероприятии отсутствует или мероприятие находится в
          другом событии
        </H4>
      </CustomSection>
    );
  }

  const rounds = !!tournamentGrid.rounds.length
    ? tournamentGrid.rounds
    : initialGrid;

  return (
    <CustomSection className="relative mb-10">
      <Grid info={tournamentGrid.grid_info} rounds={rounds} />
    </CustomSection>
  );
}
