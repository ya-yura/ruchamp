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

// type TypeUserFormOrganizerProps = {
//   organizer: z.infer<typeof formSchema>;
// };

// const formSchema = z.object({
//   organization_name: z.string().optional(),
//   website: z.string().optional(),
//   contact_email: z.string().email().optional(),
//   contact_phone: z.string().optional(),
//   description: z.string().optional(),
//   image_field: z.string().optional(),
// });

// export function UserFormOrganizer({ organizer }: TypeUserFormOrganizerProps) {
//   const [isEditMode, setIsEditMode] = useState<boolean>(false);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       organization_name: organizer?.organization_name || '',
//       website: organizer?.website || '',
//       contact_email: organizer?.contact_email || '',
//       contact_phone: organizer?.contact_phone || '',
//       description: organizer?.description || '',
//       image_field: organizer?.image_field || '',
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
//         <h2 className="mb-5 text-xl font-bold">Иформация об организации</h2>
//         {/* <div className="h-32 w-32 flex justify-center items-center ml-auto">
//           <img
//             className="w-full h-full object-cover"
//             src={form.getValues().image_field as string}
//             alt="Аватар пользователя"
//           />
//         </div> */}
//         <fieldset className="mb-5 flex flex-col gap-3">
//           <FormField
//             control={form.control}
//             name="organization_name"
//             render={({ field }) => (
//               <FormItem className="flex w-full items-center">
//                 <FormLabel className="w-2/4">Название организации</FormLabel>
//                 <FormControl>
//                   <Input
//                     className="text-black"
//                     placeholder="Название вашей организации"
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
//             name="website"
//             render={({ field }) => (
//               <FormItem className="flex w-full items-center">
//                 <FormLabel className="w-2/4">Сайт компании</FormLabel>
//                 <FormControl>
//                   <Input
//                     className="text-black"
//                     placeholder="Сайт вашей компании"
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
//             name="contact_email"
//             render={({ field }) => (
//               <FormItem className="flex w-full items-center">
//                 <FormLabel className="w-2/4">
//                   Электронная почта компании
//                 </FormLabel>
//                 <FormControl>
//                   <Input
//                     className="text-black"
//                     placeholder="Электронная почта вашей копании"
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
//             name="contact_phone"
//             render={({ field }) => (
//               <FormItem className="flex w-full items-center">
//                 <FormLabel className="w-2/4">Телефон компании</FormLabel>
//                 <FormControl>
//                   <Input
//                     className="text-black"
//                     placeholder="Телефон вашей компании"
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
//             name="description"
//             render={({ field }) => (
//               <FormItem className="flex w-full items-center">
//                 <FormLabel className="w-2/4">Описание компании</FormLabel>
//                 <FormControl>
//                   <Input
//                     className="text-black"
//                     placeholder="Описание вашей компании"
//                     disabled={!isEditMode}
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />{' '}
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
