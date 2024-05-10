import React from 'react'
import { SportsTypes } from '@/lib/constants';
import { Team } from '@/lib/definitions'

interface TeamsCardsProps {
  teams: Team[];
  selectedSportTypes: SportsTypes[];
  scrollToTop: () => void;
}


export function TeamsCards() {
  return (
    <div>TeamsCards</div>
  )
}
