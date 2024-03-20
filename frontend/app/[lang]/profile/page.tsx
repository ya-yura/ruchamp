'use client';

import { useUserStore } from '@/lib/store/user';
import { useEffect } from 'react';

export default function Profile() {
  const user = useUserStore((store) => store.user);
  console.log('zustand user from profile', user);

  useEffect(() => {
    useUserStore.persist.rehydrate();
  }, []);

  return (
    <div>
      <h2>Страница данных пользователя</h2>
      <h3>Имя</h3>
      <p>{user?.name}</p>
      <h3>Фамилия</h3>
      <p>{user?.sirname}</p>
      <h3>ID</h3>
      <p>{user?.id}</p>
    </div>
  );
}
