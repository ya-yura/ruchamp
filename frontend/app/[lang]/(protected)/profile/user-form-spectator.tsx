// 'use client';

// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import { Button } from '@/components/ui/button';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { useState } from 'react';

// type TypeUserFormSpectatorProps = {
//   spectator: z.infer<typeof formSchema>;
// };

// const formSchema = z.object({
//   phone_number: z.string().optional(),
//   image_field: z.string().optional(),
// });

// export function UserFormSpectator({ spectator }: TypeUserFormSpectatorProps) {
//   const [isEditMode, setIsEditMode] = useState<boolean>(false);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       phone_number: spectator?.phone_number || '',
//       image_field: spectator?.image_field || '',
//     },
//   });

//   function onSubmit(values: z.infer<typeof formSchema>) {
//     console.log(values);
//   }

//   return (
//     <Form {...form}>
//       <form
//         onSubmit={form.handleSubmit(onSubmit)}
//         className="bg-foreground relative rounded-xl p-9"
//       >
//         <h2 className="mb-5 text-xl font-bold">Иформация о зрителе</h2>
//         <fieldset className="mb-5 flex flex-col gap-3">
//           <FormField
//             control={form.control}
//             name="phone_number"
//             render={({ field }) => (
//               <FormItem className="flex w-full items-center">
//                 <FormLabel className="w-2/4">Телефон</FormLabel>
//                 <FormControl>
//                   <Input
//                     className="text-black"
//                     placeholder="Ваш телефон"
//                     disabled={!isEditMode}
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="image_field"
//             render={({ field }) => (
//               <FormItem className="flex w-full items-center">
//                 <FormLabel className="w-2/4">Аватар</FormLabel>
//                 <FormControl>
//                   <Input
//                     className="text-black"
//                     placeholder="Аватар"
//                     disabled={!isEditMode}
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </fieldset>
//         <div className="flex justify-end">
//           {isEditMode ? (
//             <div className="space-x-5">
//               <Button variant="ruchampDefault" type="submit">
//                 Сохранить
//               </Button>
//               <Button
//                 variant="secondary"
//                 type="button"
//                 onClick={() => setIsEditMode(!isEditMode)}
//               >
//                 Отмена
//               </Button>
//             </div>
//           ) : (
//             <Button
//               variant="ruchampDefault"
//               type="button"
//               onClick={() => setIsEditMode(!isEditMode)}
//             >
//               Редактировать
//             </Button>
//           )}
//         </div>
//       </form>
//     </Form>
//   );
// }
