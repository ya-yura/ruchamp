'use client';

import { ContentWraper } from '@/components/content-wraper';
import { CustomSection } from '@/components/custom-section';
import React, { useMemo, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Locale } from '@/i18n.config';
import { AthleteApplications } from '@/lib/definitions';
import { cn } from '@/lib/utils';
import { ProfileMatchCard } from './profile-match-card';

interface ProfileApplicationsProps {
  token?: string;
  applications: AthleteApplications[];
  tabsData: Record<string, string>;
  lang: Locale;
}

interface FilteredData {
  applications: AthleteApplications[];
  color:
    | 'greenTransparent'
    | 'darkRedSolid'
    | 'greenSolid'
    | 'blueTransparent'
    | null
    | undefined;
  text: string;
}

export function ProfileApplications({
  token,
  applications,
  tabsData,
  lang,
}: ProfileApplicationsProps) {
  const [selectedTab, setSelectedTab] = useState<string>(
    Object.keys(tabsData)[0],
  );

  function getFilteredApplications(
    applications: AthleteApplications[],
    status: string,
  ): AthleteApplications[] {
    return applications.filter((application) => application.status === status);
  }

  function handleTabChange(value: string): void {
    setSelectedTab(value);
  }

  const filteredData: FilteredData = useMemo(() => {
    switch (selectedTab) {
      case 'approved':
        return {
          applications: getFilteredApplications(applications, 'approved'),
          color: 'greenTransparent',
          text: 'Одобрено, ждёт оплаты',
        };
      case 'rejected':
        return {
          applications: getFilteredApplications(applications, 'rejected'),
          color: 'darkRedSolid',
          text: 'Отклонено',
        };
      case 'paid':
        return {
          applications: getFilteredApplications(applications, 'paid'),
          color: 'greenSolid',
          text: 'Оплачено',
        };
      default:
        return {
          applications: getFilteredApplications(applications, 'accepted'),
          color: 'blueTransparent',
          text: 'Принято, ждёт одобрения',
        };
    }
  }, [selectedTab, applications]);

  console.log('filteredData ====>', filteredData);

  return (
    <CustomSection className="relative pt-[76px]">
      <ContentWraper className="min-h-44">
        <h5 className="mb-10 text-xl font-light tracking-tighter text-ColorsGrey26 md:text-[28px]">
          Мои заявки
        </h5>
        <Tabs
          defaultValue={Object.keys(tabsData)[0]}
          className="w-full"
          onValueChange={handleTabChange}
          value={selectedTab}
        >
          <TabsList className="flex w-fit justify-between bg-transparent text-text-mutedLight">
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
              <ProfileApplicationsField
                token={token}
                applications={filteredData.applications}
                lang={lang}
                color={filteredData.color}
                text={filteredData.text}
              />
            </TabsContent>
          ))}
        </Tabs>
      </ContentWraper>
    </CustomSection>
  );
}

interface ProfileApplicationsFieldPops {
  token?: string;
  applications: AthleteApplications[];
  color:
    | 'greenTransparent'
    | 'darkRedSolid'
    | 'greenSolid'
    | 'blueTransparent'
    | null
    | undefined;
  text: string;
  lang: Locale;
}

function ProfileApplicationsField({
  token,
  applications,
  color,
  text,
  lang,
}: ProfileApplicationsFieldPops) {
  return (
    <div className="rounded-lg bg-black px-2 pb-2 pt-4">
      {!applications.length ? (
        <p className="relative mb-4 mr-auto text-base text-background">
          Заявок пока что нет
        </p>
      ) : (
        <ul className="flex flex-col gap-3 ">
          {applications.map((application) => (
            <ProfileMatchCard
            token={token}
              key={application.application_id}
              eventId={application.event_id}
              eventName={application.event_name}
              matchId={application.match_id}
              matchName={application.match_name}
              applicationId={application.application_id}
              startTime={application.start_datetime}
              sportType={application.sport_type}
              grade={application.grade}
              gender={application.gender}
              weightClass={application.weight_class}
              weightMin={application.weight_min}
              weightMax={application.weight_max}
              ageMin={application.age_min}
              ageMax={application.age_max}
              status={application.status}
              // result={application.athlete_result}
              buttonText={'Отозвать заявку'}
              lang={lang}
              color={color}
              text={text}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
