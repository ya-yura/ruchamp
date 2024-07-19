'use client';

import { AthleteCard } from '@/components/cards/athlete-card';
import { H4 } from '@/components/text';
import { ApplicationMember, ApplicationTeam } from '@/lib/definitions';
import React, { useState, useMemo, useCallback } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Marker } from './marker';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { updateApplicationStatus } from '@/lib/data';

interface MatchApplications {
  approved: ApplicationTeam[];
  accepted: ApplicationTeam[];
  paid: ApplicationTeam[];
  rejected: ApplicationTeam[];
}

interface ApplicationTeamProps {
  id: string;
  token: string | undefined;
  applications: Record<number, MatchApplications>;
  tabsData: Record<string, string>;
}

interface FilteredData {
  applications: ApplicationTeam[];
  color: 'orange' | 'red' | 'green' | 'blue';
  text: string;
}

export function EventApplications({
  id,
  token,
  applications,
  tabsData,
}: ApplicationTeamProps) {
  const [selectedTabValue, setSelectedTabValue] = useState<string>(
    Object.keys(tabsData)[0],
  );

  const onTabSelect = useCallback((value: string) => {
    setSelectedTabValue(value);
  }, []);

  const getFilteredData = useCallback(
    (matchApplications: MatchApplications): FilteredData => {
      switch (selectedTabValue) {
        case 'approved':
          return {
            applications: matchApplications.approved || [],
            color: 'orange',
            text: 'Ждём платёж',
          };
        case 'rejected':
          return {
            applications: matchApplications.rejected || [],
            color: 'red',
            text: 'Отклонено',
          };
        case 'paid':
          return {
            applications: matchApplications.paid || [],
            color: 'green',
            text: 'Оплатили участие',
          };
        default:
          return {
            applications: matchApplications.accepted || [],
            color: 'blue',
            text: 'Ждут одобрения',
          };
      }
    },
    [selectedTabValue],
  );

  const handleApprove = async (
    event_id: string,
    application_id: number,
    status: string,
  ) => {
    if (!token) return;

    try {
      await updateApplicationStatus(
        token,
        parseInt(event_id),
        application_id,
        status,
      );
    } catch (error) {
      console.error('Failed to approve application:', error);
    }
  };

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
      {Object.entries(applications).map(([matchId, matchApplications]) => {
        const filteredData = useMemo(
          () => getFilteredData(matchApplications),
          [matchApplications, getFilteredData],
        );
        return (
          <div className="relative w-[100%]" key={matchId}>
            {filteredData.applications.length === 0 && (
              <p className="relative mb-4 mr-auto text-base text-background">
                Заявок пока что нет
              </p>
            )}
            <ul>
              {filteredData.applications.map((application, index) => (
                <li
                  className="mb-3 flex flex-col gap-2 rounded-lg bg-black px-4 pb-4 pt-4"
                  key={index}
                >
                  <div className="flex justify-between">
                    <div className="mb-3 flex justify-between gap-6 px-2">
                      <H4>{application.name}</H4>
                      <H4>
                        Количество участников: {application.members.length}
                      </H4>
                    </div>
                    <Marker variant={filteredData.color}>
                      {filteredData.text}
                    </Marker>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {application.members.map((athlete) => (
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
                  {filteredData.color === 'blue' && (
                    <div className="mt-2 flex justify-between">
                      <Button
                        onClick={() =>
                          handleApprove(
                            id,
                            application.members[0].application_id,
                            'approved',
                          )
                        }
                        variant={'transparentGreen'}
                        size={'sm'}
                      >
                        <Image
                          className="mr-2"
                          src={'/images/icons/approve.svg'}
                          alt="Иконка одобрить"
                          width={20}
                          height={20}
                        />
                        Одобрить участие
                      </Button>
                      <Button
                        onClick={() =>
                          handleApprove(
                            id,
                            application.members[0].application_id,
                            'rejected',
                          )
                        }
                        variant={'transparentRed'}
                        size={'sm'}
                      >
                        <Image
                          className="mr-2"
                          src={'/images/icons/dismiss.svg'}
                          alt="Иконка отклонить"
                          width={20}
                          height={20}
                        />
                        Отказать в участии
                      </Button>
                    </div>
                  )}
                  {filteredData.color === 'orange' && (
                    <div className="mt-2">
                      <Button
                        onClick={() =>
                          handleApprove(
                            id,
                            application.members[0].application_id,
                            'rejected',
                          )
                        }
                        variant={'transparentRed'}
                        size={'sm'}
                      >
                        <Image
                          className="mr-2"
                          src={'/images/icons/dismiss.svg'}
                          alt="Иконка отклонить"
                          width={20}
                          height={20}
                        />
                        Отказать в участии
                      </Button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </>
  );
}
