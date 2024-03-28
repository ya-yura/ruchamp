import { create } from 'zustand';
import type { TypeUser } from '../definitions';
import { persist } from 'zustand/middleware';
import { auth } from '../client-api/auth';

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
        auth
          .getCurrentUser(token)
          .then((res) => {
            set((state) => ({
              user: (state.user = res),
            }));
          })
          .catch((err) =>
            console.error('Error occured while fetching user:', err),
          );
      },
      updateUser: (data: Partial<TypeUser>) =>
        set((state) => ({
          user: Object.assign(state.user as TypeUser, data),
        })),
    }),
    { name: 'user-store', skipHydration: true },
  ),
);
