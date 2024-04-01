'use client';

import { useEffect, useState } from 'react';
import { EventHero } from './event-hero';
import { InfoSection } from './info-section';
import {
  SelectTabData,
  SelectTabEvent,
  TabValue,
} from '@fluentui/react-components';
import { useUserStore } from '@/lib/store/user';
import { getUserData } from '@/lib/actions';
import { useSession } from 'next-auth/react';

export function EventInfo() {
  const [selectedValue, setSelectedValue] = useState<TabValue>('info');

  const user = useUserStore((store) => store.user);
  const { data: session, status } = useSession();
  const getUser = useUserStore((state) => state.getUser);

  // Still don't know if it's needed
  useEffect(() => {
    useUserStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (session?.user?.name && status === 'authenticated') {
      const token = session.user?.name;
      localStorage.setItem('jwt', token);
      getUser(token);
      getUserData(token);
    }
  }, [session, status]);

  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    setSelectedValue(data.value);
  };
  return (
    <>
      <EventHero selectedValue={selectedValue} onTabSelect={onTabSelect} />
      <InfoSection selectedValue={selectedValue} />
    </>
  );
}
