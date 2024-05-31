// 'use client';

// import React, { useState } from 'react';
// import { EnumUserRole, UserBasicData } from '@/lib/definitions';
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
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
// } from '@/components/ui/select';
// import { SelectValue } from '@radix-ui/react-select';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// const formSchema = z.object({
//   name: z.string().min(2).max(50),
//   fathername: z.string().min(2).max(50),
//   sirname: z.string().min(2).max(50),
//   username: z.string().min(2).max(50),
//   email: z.string().email(),
//   birthdate: z.string(),
//   country: z.string(),
//   role_id: z.string(),
//   gender: z.string(),
// });

// export function UserForm({ user }: { user: UserBasicData }) {
//   const [isEditMode, setIsEditMode] = useState<boolean>(false);
//   const role = () => {
//     switch (user.role_id) {
//       case EnumUserRole['athlete']:
//         return 'Спортсмен';
//       case EnumUserRole['organizer']:
//         return 'Организатор';
//       case EnumUserRole['spectator']:
//         return 'Зритель';
//       // case EnumUserRole['admin']:
//       //   return 'Администратор';
//       case EnumUserRole['referee']:
//         return 'Судья';
//     }
//   };

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: user.name,
//       fathername: user.fathername,
//       sirname: user.sirname,
//       username: user.username,
//       email: user.email,
//       birthdate: user.birthdate,
//       country: user.country,
//       role_id: role(),
//       gender: user.gender ? 'male' : 'female',
//     },
//   });

//   function onSubmit(values: z.infer<typeof formSchema>) {
//     console.log(values);
//   }

//   return (
//     <Form {...form}>
//       <form
//         onSubmit={form.handleSubmit(onSubmit)}
//         className="relative rounded-xl bg-foreground p-9"
//       >
//         <h2 className="mb-5 text-xl font-bold">Общая информация</h2>
//         <fieldset className="mb-5 flex flex-col gap-3">
//           <FormField
//             control={form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem className="flex w-full items-center">
//                 <FormLabel className="w-2/4">Имя</FormLabel>
//                 <FormControl>
//                   <Input
//                     className="text-black"
//                     placeholder="Ваше имя"
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
//             name="sirname"
//             render={({ field }) => (
//               <FormItem className="flex w-full items-center">
//                 <FormLabel className="w-2/4">Фамилия</FormLabel>
//                 <FormControl>
//                   <Input
//                     className="text-black"
//                     placeholder="Ваша фамилия"
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
//             name="fathername"
//             render={({ field }) => (
//               <FormItem className="flex w-full items-center">
//                 <FormLabel className="w-2/4">Отчество</FormLabel>
//                 <FormControl>
//                   <Input
//                     className="text-black"
//                     placeholder="Ваше отчество"
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
//             name="username"
//             render={({ field }) => (
//               <FormItem className="flex w-full items-center">
//                 <FormLabel className="w-2/4">Юзернейм</FormLabel>
//                 <FormControl>
//                   <Input
//                     className="text-black"
//                     placeholder="Ваш юзернейм"
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
//             name="email"
//             render={({ field }) => (
//               <FormItem className="flex w-full items-center">
//                 <FormLabel className="w-2/4">Электронная почта</FormLabel>
//                 <FormControl>
//                   <Input
//                     className="text-black"
//                     placeholder="Ваша почта"
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
//             name="birthdate"
//             render={({ field }) => (
//               <FormItem className="flex w-full items-center">
//                 <FormLabel className="w-2/4">Дата рождения</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="date"
//                     className="text-black"
//                     placeholder="Ваша почта"
//                     disabled={!isEditMode}
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           {/* <FormField
//             control={form.control}
//             name="country"
//             render={({ field }) => (
//               <FormItem className="flex w-full items-center">
//                 <FormLabel className="w-2/4">Страна</FormLabel>
//                 <Select
//                   onValueChange={field.onChange}
//                   defaultValue={field.value}
//                   disabled={!isEditMode}
//                 >
//                   <FormControl>
//                     <SelectTrigger className="text-black placeholder:text-gray-500">
//                       <SelectValue placeholder="Выберите страну" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {Object.entries(EnumCountries).map(([key, value]) => (
//                       <SelectItem key={key} value={key}>
//                         {value}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           /> */}
//           <FormField
//             control={form.control}
//             name="role_id"
//             render={({ field }) => (
//               <FormItem className="flex w-full items-center">
//                 <FormLabel className="w-2/4">Роль</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="text"
//                     className="text-black"
//                     placeholder="Ваша роль"
//                     disabled={true}
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="gender"
//             render={({ field }) => (
//               <FormItem className="flex w-full items-center">
//                 <FormLabel className="w-2/4">Пол</FormLabel>
//                 <FormControl>
//                   <RadioGroup
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}
//                     className="flex space-x-1"
//                     disabled={true}
//                   >
//                     <FormItem className="flex items-center space-x-3 space-y-0">
//                       <FormControl>
//                         <RadioGroupItem
//                           className="border-white text-white"
//                           value="male"
//                         />
//                       </FormControl>
//                       <FormLabel className="font-normal">Мужской</FormLabel>
//                     </FormItem>
//                     <FormItem className="flex items-center space-x-3 space-y-0">
//                       <FormControl>
//                         <RadioGroupItem
//                           className="border-white text-white"
//                           value="female"
//                         />
//                       </FormControl>
//                       <FormLabel className="font-normal">Женский</FormLabel>
//                     </FormItem>
//                   </RadioGroup>
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
