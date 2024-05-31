// import { create } from 'zustand';
// // import type { UserData } from '../definitions';
// import { persist } from 'zustand/middleware';
// import { auth } from '../api/auth';

// // export type TypeState = {
// //   user: UserData | null;
// // };

// export type TypeActions = {
//   getUser: (token: string) => Promise<void>;
//   // updateUser: (data: UserData) => void;
// };

// export const useUserStore = create<TypeState & TypeActions>()(
//   persist(
//     (set) => ({
//       user: null,
//       getUser: async (token: string) => {
//         auth
//           .getCurrentUser(token)
//           // .then((res) => {
//           //   set((state) => ({
//           //     user: (state.user = res),
//           //   }));
//           // })
//           .catch((err) =>
//             console.error('Error occured while fetching user:', err),
//           );
//       },
//       // updateUser: (data: UserData) =>
//       //   set((state) => ({
//       //     user: Object.assign(state.user as UserData, data),
//       //   })),
//     }),
//     { name: 'user-store', skipHydration: true },
//   ),
// );
