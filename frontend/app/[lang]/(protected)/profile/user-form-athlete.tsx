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

// type TypeUserFormAthleteProps = {
//   athlete: z.infer<typeof formSchema>;
// };

// const formSchema = z.object({
//   weight_category: z.string().optional(),
//   weight: z.number().optional(),
//   height: z.number().optional(),
//   belt_rank: z.string().optional(),
//   coach_name: z.string().optional(),
//   image_field: z.string().optional(),
//   combat_types: z.string().array().optional(),
//   coaches: z.string().array().optional(),
// });

// export function UserFormAthlete({ athlete }: TypeUserFormAthleteProps) {
//   const [isEditMode, setIsEditMode] = useState<boolean>(false);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       weight_category: '',
//       weight: athlete?.weight,
//       height: athlete?.height,
//       belt_rank: '',
//       coach_name: '',
//       image_field: '',
//       combat_types: [],
//       coaches: [],
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
//         <h2 className="mb-5 text-xl font-bold">Иформация спортсмена</h2>
//         <fieldset className="mb-5 flex flex-col gap-3">
//           <FormField
//             control={form.control}
//             name="weight_category"
//             render={({ field }) => (
//               <FormItem className="flex w-full items-center">
//                 <FormLabel className="w-2/4">Весовая категория</FormLabel>
//                 <FormControl>
//                   <Input
//                     className="text-black"
//                     placeholder="Ваша весовая категория"
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
//             name="weight"
//             render={({ field }) => (
//               <FormItem className="flex w-full items-center">
//                 <FormLabel className="w-2/4">Вес</FormLabel>
//                 <FormControl>
//                   <Input
//                     className="text-black"
//                     placeholder="Ваш вес"
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
//             name="height"
//             render={({ field }) => (
//               <FormItem className="flex w-full items-center">
//                 <FormLabel className="w-2/4">Рост</FormLabel>
//                 <FormControl>
//                   <Input
//                     className="text-black"
//                     placeholder="Ваш рост"
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
//             name="belt_rank"
//             render={({ field }) => (
//               <FormItem className="flex w-full items-center">
//                 <FormLabel className="w-2/4">Ранг</FormLabel>
//                 <FormControl>
//                   <Input
//                     className="text-black"
//                     placeholder="Ваш ранг"
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
//             name="coach_name"
//             render={({ field }) => (
//               <FormItem className="flex w-full items-center">
//                 <FormLabel className="w-2/4">Имя тренера</FormLabel>
//                 <FormControl>
//                   <Input
//                     className="text-black"
//                     placeholder="Ваш тренер"
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
//             name="combat_types"
//             render={({ field }) => (
//               <FormItem className="flex w-full items-center">
//                 <FormLabel className="w-2/4">Виды спорта</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="text"
//                     className="text-black"
//                     placeholder="Ваши виды спорта"
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
//             name="coaches"
//             render={({ field }) => (
//               <FormItem className="flex w-full items-center">
//                 <FormLabel className="w-2/4">Тренеры</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="text"
//                     className="text-black"
//                     placeholder="Тренеры"
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
