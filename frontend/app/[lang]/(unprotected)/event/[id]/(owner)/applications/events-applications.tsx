'use client';

import { AthleteCard } from '@/components/cards/athlete-card';
import { H4 } from '@/components/text';
import {
  Applications,
  ApplicationMember,
  ApplicationTeam,
} from '@/lib/definitions';
import React, { useState, useMemo, useCallback } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { se } from 'date-fns/locale';
import { inter } from '@/app/[lang]/ui/fonts';
import { Marker } from './marker';

// interface ApplicationsProps {
//   applications: Applications;
//   tabsData: Record<string, string>;
// }

interface ApplicationTeamProps {
  approved: ApplicationTeam[];
  accepted: ApplicationTeam[];
  paid: ApplicationTeam[];
  rejected: ApplicationTeam[];
  tabsData: Record<string, string>;
}

export function EventApplications({
  paid,
  accepted,
  approved,
  rejected,
  tabsData,
}: ApplicationTeamProps) {
  const [selectedTabValue, setSelectedTabValue] = useState<string>(
    Object.keys(tabsData)[0],
  );

  const onTabSelect = useCallback((value: string) => {
    setSelectedTabValue(value);
  }, []);

  const filteredData = useMemo(() => {
    switch (selectedTabValue) {
      case 'approved':
        return {
          applications: approved,
          color: 'orange' as 'orange',
          text: 'Ждём платёж',
        };
      case 'rejected':
        return {
          applications: rejected,
          color: 'red' as 'red',
          htext: 'Отклонено',
        };
      case 'paid':
        return {
          applications: paid,
          color: 'green' as 'green',
          text: 'Оплатили участие',
        };
      default:
        return {
          applications: accepted,
          color: 'blue' as 'blue',
          text: 'Ждут одобрения',
        };
    }
  }, [selectedTabValue, approved, accepted, paid, rejected]);

  return (
    <>
      <div className="flex w-full justify-between">
        <Tabs
          defaultValue={Object.keys(tabsData)[0]}
          className="w-fit"
          onValueChange={onTabSelect}
          value={selectedTabValue}
        >
          <ScrollArea className="-mx-4 w-screen sm:mx-0 sm:w-full">
            <TabsList className="mb-10 flex w-fit justify-between bg-transparent text-text-mutedLight sm:mx-auto">
              {Object.entries(tabsData).map(([key, value]) => (
                <TabsTrigger
                  key={key}
                  className={cn(
                    'first-of-type:ml-4 last-of-type:mr-4',
                    'sm:first-of-type:ml-0 sm:last-of-type:mr-0',
                  )}
                  value={key}
                >
                  {value}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar className="hidden" orientation="horizontal" />
          </ScrollArea>
        </Tabs>
      </div>
      <ul className="relative w-[100%] ">
        <li>
          <ul>
            {!filteredData.applications.length ? (
              <p className="relative mb-4 mr-auto text-base text-background">
                Заявок пока что нет
              </p>
            ) : (
              filteredData.applications.map(
                (application: ApplicationTeam, index: number) => (
                  <li
                    className="mb-3 flex flex-col gap-2 rounded-lg bg-black px-4 pb-4 pt-4"
                    key={index}
                  >
                    <div className="flex justify-between">
                      <div className="mb-3 flex justify-between gap-6 px-2">
                        {' '}
                        <H4>{application.name}</H4>
                        <H4>
                          Количество участников: {application.members.length}
                        </H4>
                      </div>
                      <Marker
                        variant={filteredData.color}
                        children={filteredData.text}
                      />
                    </div>
                    <ul className="flex flex-col gap-2">
                      {application.members.map((athlete: ApplicationMember) => (
                        <AthleteCard
                          key={athlete.id}
                          id={athlete.id}
                          sirname={athlete.sirname}
                          name={athlete.name}
                          fathername={athlete.fathername}
                          birthdate={athlete.birthdate}
                          city={athlete.city}
                          country={athlete.country}
                          region={athlete.region}
                          image_field={athlete.image_field || ''}
                          weight={athlete.weight}
                          grade_types={athlete.grade_types}
                        />
                      ))}
                    </ul>
                  </li>
                ),
              )
            )}
            {/* {filteredData.applications.map(
              (application: ApplicationTeam, index: number) => (
                <li
                  className="mb-3 flex flex-col gap-2 rounded-lg bg-black px-4 pb-4 pt-4"
                  key={index}
                >
                  <div className="flex justify-between">
                    <div className="mb-3 flex justify-between gap-6 px-2">
                      {' '}
                      <H4>{application.name}</H4>
                      <H4>
                        Количество участников: {application.members.length}
                      </H4>
                    </div>
                    <Marker
                      variant={filteredData.color}
                      children={filteredData.text}
                    />
                  </div>
                  <ul className="flex flex-col gap-2">
                    {application.members.map((athlete: ApplicationMember) => (
                      <AthleteCard
                        key={athlete.id}
                        id={athlete.id}
                        sirname={athlete.sirname}
                        name={athlete.name}
                        fathername={athlete.fathername}
                        birthdate={athlete.birthdate}
                        city={athlete.city}
                        country={athlete.country}
                        region={athlete.region}
                        image_field={athlete.image_field || ''}
                        weight={athlete.weight}
                        grade_types={athlete.grade_types}
                      />
                    ))}
                  </ul>
                </li>
              ),
            )} */}
          </ul>
        </li>
      </ul>
    </>
  );
}
