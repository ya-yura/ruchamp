import { AthleteCard } from '@/components/cards/athlete-card';
import { H4 } from '@/components/text';
import { Applications } from '@/lib/definitions';
import React from 'react';

interface ApplicationsProps {
  applications: Applications | null;
}

// console.log('applications ==>', applications);

export function EventApplications({ applications }: ApplicationsProps) {
  if (!applications || !!Object.keys(applications).length) {
    <p className="relative mb-4 mr-auto text-base text-background">
      Заявок пока что нет
    </p>;
  }

  return (
    <>
      <ul className="relative w-[100%] ">
        <li>
          <ul >
            {applications?.paid?.map((application) => (
              <li className="rounded-lg bg-black px-4 pb-4 pt-4 mb-3" key={application.id}>
                <div className="flex px-2 pb-3 gap-6 ">
                  <H4>{application.name}</H4>
                  <H4>Количество участников: {application.members.length}</H4>
                </div>
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
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </>
  );
}
