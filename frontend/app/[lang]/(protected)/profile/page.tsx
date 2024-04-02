import Image from 'next/image';
import { Container } from '../../ui/container';
import { UserForm } from './user-form';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { auth } from '@/lib/api/auth';

export default async function Profile() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.name as string;
  const user = await auth.getCurrentUser(token);
  return (
    <Container>
      <section className="relative mt-[-92px] flex h-[720px] w-full flex-col items-center justify-between bg-[#0A0A0A] px-[72px] pt-[92px]">
        <Image
          className="opacity-50"
          src="/ru/images/event-hero-bg.jpeg"
          alt={'ДОБАВИТЬ ОПИСАНИЕ'}
          fill={true}
          style={{ objectFit: 'cover' }}
        />
        <UserForm user={user}/>
      </section>
    </Container>
  );
}

// 'use client';

// import { useUserStore } from '@/lib/store/user';
// import {
//   Button,
//   RadioGroupOnChangeData,
//   SelectOnChangeData,
//   useId,
// } from '@fluentui/react-components';
// import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
// import { useDictionary } from '../../dictionary-provider';
// import { useForm } from '@/lib/hooks/useForm';
// import { profileFields } from './constants';
// import { UserFieldset } from '../../ui/forms/user-fieldset';

// export default function Profile() {
//   const [errorMessage, setErrorMessage] = useState<string>('');
//   const [isEditMode, setIsEditMode] = useState<boolean>(false);
//   const user = useUserStore((store) => store.user);
//   const { page, common } = useDictionary();
//   const { values, handleChange, setValues } = useForm();
//   const selectId = useId();

//   const roles: Record<string, string> = {
//     [common.roles[1]]: '1',
//     [common.roles[2]]: '2',
//     [common.roles[3]]: '3',
//     [common.roles[4]]: '4',
//     [common.roles[5]]: '5',
//   };

//   useEffect(() => {
//     useUserStore.persist.rehydrate();
//   }, []);

//   useEffect(() => {
//     if (user) {
//       setValues({
//         email: user.email,
//         username: user.username,
//         name: user.name,
//         sirname: user.sirname,
//         fathername: user.fathername,
//         country: user.country,
//         birthdate: user.birthdate,
//         gender: user.gender === true ? 'male' : 'female',
//         // role_id: user.role_id,
//       });
//     }
//   }, [user]);

//   function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
//     e.preventDefault();
//     console.log('submit');
//   }

//   function switchMode() {
//     setIsEditMode(!isEditMode);
//     if (user) {
//       setValues({
//         email: user.email,
//         username: user.username,
//         name: user.name,
//         sirname: user.sirname,
//         fathername: user.fathername,
//         country: user.country,
//         birthdate: user.birthdate,
//         gender: user.gender === true ? 'male' : 'female',
//         // role_id: user.role_id,
//       });
//     }
//   }

//   function handleRadioChange(
//     ev: FormEvent<HTMLDivElement>,
//     data: RadioGroupOnChangeData,
//   ): void {
//     if (data.value === 'male' || data.value === 'female') {
//       setValues((prevValues) => ({
//         ...prevValues,
//         gender: data.value === 'male' ? true : false,
//       }));
//     }
//   }

//   function handleSelectChange(
//     ev: ChangeEvent<HTMLSelectElement>,
//     data: SelectOnChangeData,
//   ): void {
//     const roleId = parseInt(data.value);
//     if (!isNaN(roleId)) {
//       setValues((prevValues) => ({
//         ...prevValues,
//         role_id: roleId,
//       }));
//     }
//   }

//   return (
//     <main className="flex min-h-[calc(100vh-112px)] flex-col items-center justify-start py-11">
//       <form
//         className="mt-8 flex w-2/3 max-w-[800px] flex-col justify-evenly rounded-md bg-slate-500 px-20 py-6"
//         onSubmit={handleSubmit}
//       >
//         <UserFieldset
//           user={user}
//           isDisabled={!isEditMode}
//           subtitle={page.profile.subtitle}
//           fields={profileFields}
//           handleChange={handleChange}
//           handleRadioChange={handleRadioChange}
//           handleSelectChange={handleSelectChange}
//           values={values}
//           chooseOption={page.register.chooseRole}
//           roles={roles}
//           errorMessage={errorMessage}
//           otherInputProps={{
//             appearance: 'underline',
//           }}
//         />

//         {/* <fieldset
//           className="relative mb-6 grid h-auto w-full grid-cols-2 gap-x-11 gap-y-5 pb-8 pt-6"
//           disabled={!isEditMode}
//         >
//           <legend className="text-center">
//             <Subtitle2Stronger>{page.profile.subtitle}</Subtitle2Stronger>
//           </legend>
//           {profileFields.map((item, index) => {
//             const { label, type, placeholder, name } = item;
//             return (
//               <InputField
//                 key={index}
//                 fieldProps={{
//                   label,
//                 }}
//                 inputProps={{
//                   type,
//                   placeholder,
//                   onChange: handleChange,
//                   value: (values[name as keyof TypeUser] as string) || '',
//                   name,
//                   appearance: 'underline',
//                 }}
//               />
//             );
//           })}
//           <Field label="Пол" required size="large">
//             <RadioGroup
//               layout="horizontal"
//               name="gender"
//               onChange={handleRadioChange}
//             >
//               <Radio value="male" label="Мужской" />
//               <Radio value="female" label="Женский" />
//             </RadioGroup>
//           </Field>
//           <Field size="large">
//             <Label htmlFor={selectId} required size="large">
//               Роль
//             </Label>
//             <Select
//               name="role_id"
//               id={selectId}
//               appearance="outline"
//               onChange={handleSelectChange}
//               defaultValue=""
//             >
//               <option value="" disabled>
//                 {page.register.chooseRole}
//               </option>
//               {Object.entries(roles).map(([key, value]) => (
//                 <option key={value} value={value}>
//                   {key}
//                 </option>
//               ))}
//             </Select>
//           </Field>
//         </fieldset> */}
//         <div className="ml-auto mr-auto">
//           {isEditMode ? (
//             <div className="flex gap-4">
//               <Button
//                 appearance="secondary"
//                 size="large"
//                 type="button"
//                 onClick={switchMode}
//                 // disabled={isLoading}
//               >
//                 {/* {isLoading && <Spinner size="tiny" label="" />}{' '} */}
//                 {page.profile.cancel}
//               </Button>
//               <Button
//                 appearance="primary"
//                 size="large"
//                 type="submit"
//                 // disabled={isLoading}
//               >
//                 {/* {isLoading && <Spinner size="tiny" label="" />}{' '} */}
//                 {page.profile.save}
//               </Button>
//             </div>
//           ) : (
//             <Button
//               appearance="primary"
//               size="large"
//               type="button"
//               onClick={switchMode}
//               // disabled={isLoading}
//             >
//               {/* {isLoading && <Spinner size="tiny" label="" />}{' '} */}
//               {page.profile.edit}
//             </Button>
//           )}
//         </div>
//       </form>
//     </main>
//   );
// }
