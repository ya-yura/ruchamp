import { create } from 'zustand';
import type { TypeUser } from '../definitions';
import { persist } from 'zustand/middleware';

export type TypeState = {
  user: TypeUser | null;
};

export type TypeActions = {
  getUser: (token: string) => Promise<void>;
  updateUser: (data: Partial<TypeUser>) => void;
};

export const useUserStore = create<TypeState & TypeActions>()(
  persist(
    (set) => ({
      user: null,
      getUser: async (token: string) => {
        const headers = {
          'Content-Type': 'application/x-www-form-urlencoded',
          authorization: `Bearer ${token}`,
        };
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/users/me`,
            {
              headers: headers,
            },
          );
          if (res.ok) {
            const data = await res.json();
            set((state) => ({
              user: (state.user = data),
            }));
          }
        } catch (error) {
          console.error('Error occured while fetching user:', error);
        }
      },
      updateUser: (data: Partial<TypeUser>) =>
        set((state) => ({
          user: Object.assign(state.user as TypeUser, data),
        })),
    }),
    { name: 'user-store', skipHydration: true },
  ),
);
