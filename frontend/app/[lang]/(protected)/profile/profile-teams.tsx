'use client';

import { BigCardWithImage } from '@/components/cards/big-card-with-image';
import { ContentWraper } from '@/components/content-wraper';
import { CustomSection } from '@/components/custom-section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Locale } from '@/i18n.config';
import { AllRegions, Country, TeamDetails } from '@/lib/definitions';
import { cn } from '@/lib/utils';
import React, { useMemo, useState } from 'react';

interface ProfileTeamsProps {
  athleteId: number;
  teams: TeamDetails[];
  tabsData: Record<string, string>;
  lang: Locale;
}

export function ProfileTeams({
  athleteId,
  teams,
  tabsData,
  lang,
}: ProfileTeamsProps) {
  const [selectedTab, setSelectedTab] = useState<string>(
    Object.keys(tabsData)[0],
  );

  const filteredTeams = useMemo(() => {
    return selectedTab === 'capitan'
      ? teams.filter((team) => team.captain_id === athleteId)
      : teams.filter((team) => team.captain_id !== athleteId);
  }, [selectedTab, teams]);

  function handleTabChange(value: string): void {
    setSelectedTab(value);
  }
  return (
    <CustomSection className="relative pt-[76px]">
      <ContentWraper className="min-h-44">
        <h5 className="mb-10 text-xl font-light tracking-tighter text-ColorsGrey26 md:text-[28px]">
          Мои команды
        </h5>
        <Tabs
          defaultValue={Object.keys(tabsData)[0]}
          className="w-full"
          onValueChange={handleTabChange}
          value={selectedTab}
        >
          <TabsList className="flex mb-5 w-fit justify-between bg-transparent text-text-mutedLight">
            {Object.entries(tabsData).map(([key, value]) => (
              <TabsTrigger
                key={key}
                className={cn(
                  'group',
                  'first-of-type:ml-4 last-of-type:mr-4',
                  'sm:first-of-type:ml-0 sm:last-of-type:mr-0',
                )}
                value={key}
              >
                {value}
              </TabsTrigger>
            ))}
          </TabsList>
          {Object.entries(tabsData).map(([key, value]) => (
            <TabsContent className="mt-0" key={key} value={key}>
              {!!filteredTeams.length ? (
                <ul className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredTeams.map((team) => (
                    <BigCardWithImage
                      key={team.team_id}
                      type={'team'}
                      id={team.team_id}
                      name={team.name}
                      tags={''} // add later
                      title={`${team.captain.sirname} ${team.captain.name} ${team.captain.fathername}`}
                      subtitle={`${team.city}, ${AllRegions[team.region]}, ${Country[team.country]}`}
                      description={team.description}
                      image={team.image_field}
                      lang={lang}
                    />
                  ))}
                </ul>
              ) : (
                <p className="mb-4 mr-auto text-base text-background">
                  В этом разделе не найдено команд
                </p>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </ContentWraper>
    </CustomSection>
  );
}
