'use client';

import React, { useEffect, useState } from 'react';
import { InputField } from '../../ui/auth/input-field';
import { EnumCountries, EnumUserRole, TypeUser } from '@/lib/definitions';
import { CustomForm } from '../../ui/forms/custom-form';
import { Field, Radio, RadioGroup } from '@fluentui/react-components';
import { CustomSelect } from '../../ui/forms/custom-select';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  name: z.string().min(2).max(50),
});

export function UserForm({ user }: { user: TypeUser }) {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  // const { values, setValues, handleChange, handleSelectChange } = useForm();

  // Set values from user's data
  // useEffect(() => {
  //   const { name, fathername, sirname, username, email, country } = user;
  //   if (user) {
  //     setValues((prevValues) => ({
  //       ...prevValues,
  //       ...{ name, fathername, sirname, username, email, country },
  //     }));
  //   }
  // }, [setValues, user]);

  console.log(user)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: 'user.name',
    },
  });

  const role = () => {
    switch (user?.role_id) {
      case EnumUserRole['athlete']:
        return 'Спортсмен';
      case EnumUserRole['organizer']:
        return 'Организатор';
      case EnumUserRole['spectator']:
        return 'Зритель';
      case EnumUserRole['admin']:
        return 'Администратор';
      case EnumUserRole['referee']:
        return 'Судья';
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="relative bg-foreground p-9 rounded-xl">
        <fieldset>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ваше имя</FormLabel>
                <FormControl>
                  <Input className='text-black' placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>
        <Button type="submit">Submit</Button>
      </form>
    </Form>

    // <CustomForm className="w-2/3 bg-black" onSubmit={handleSubmit}>
    //   <fieldset className="mb-5  flex flex-col gap-3">
    //     <InputField
    //       fieldProps={{
    //         className: styles.label,
    //         label: 'Имя',
    //         orientation: 'horizontal',
    //       }}
    //       inputProps={{
    //         type: 'text',
    //         name: 'name',
    //         placeholder: 'Ваше имя',
    //         appearance: 'underline',
    //         disabled: true,
    //         onChange: handleChange,
    //         value: values.name || '',
    //       }}
    //     />
    //     <InputField
    //       fieldProps={{
    //         label: 'Отчество',
    //         orientation: 'horizontal',
    //       }}
    //       inputProps={{
    //         type: 'text',
    //         name: 'fathername',
    //         placeholder: 'Ваше отчество',
    //         onChange: handleChange,
    //         value: values.fathername || '',
    //       }}
    //     />
    //     <InputField
    //       fieldProps={{
    //         label: 'Фамилия',
    //         orientation: 'horizontal',
    //       }}
    //       inputProps={{
    //         type: 'text',
    //         name: 'sirname',
    //         placeholder: 'Ваша фамилия',
    //         onChange: handleChange,
    //         value: values.sirname || '',
    //       }}
    //     />
    //     <InputField
    //       fieldProps={{
    //         label: 'Юзернейм',
    //         orientation: 'horizontal',
    //       }}
    //       inputProps={{
    //         type: 'text',
    //         name: 'username',
    //         placeholder: 'Ваш юзернейм',
    //         onChange: handleChange,
    //         value: values.username || '',
    //       }}
    //     />
    //     <InputField
    //       fieldProps={{
    //         label: 'Электронная почта',
    //         orientation: 'horizontal',
    //       }}
    //       inputProps={{
    //         type: 'text',
    //         name: 'email',
    //         placeholder: 'Ваша почта',
    //         onChange: handleChange,
    //         value: values.email || '',
    //       }}
    //     />
    //     <InputField
    //       fieldProps={{
    //         label: 'День рождения',
    //         orientation: 'horizontal',
    //       }}
    //       inputProps={{
    //         type: 'date',
    //         name: 'birthdate',
    //         value: user?.birthdate || '',
    //       }}
    //     />
    //     <CustomSelect
    //       label={'Страна'}
    //       defaultOption={EnumCountries[values.country] || ''}
    //       id={'country'}
    //       onSelect={handleSelectChange}
    //       options={EnumCountries}
    //       fieldProps={{
    //         orientation: 'horizontal',
    //       }}
    //     />
    //     <InputField
    //       fieldProps={{
    //         label: 'Роль',
    //         orientation: 'horizontal',
    //       }}
    //       inputProps={{
    //         type: 'text',
    //         placeholder: 'Ваша роль',
    //         onChange: handleChange,
    //         value: role() || '',
    //       }}
    //     />
    //     <Field label="Пол" orientation="horizontal" required>
    //       <RadioGroup
    //         onChange={() => {}}
    //         name={'gender'}
    //         id={'gender'}
    //         as="div"
    //         defaultValue={user.gender ? 'male' : 'female'}
    //         layout="horizontal"
    //         disabled
    //       >
    //         <Radio value="male" label="Мужчина" as="input" />
    //         <Radio value="female" label="Женщина" as="input" />
    //       </RadioGroup>
    //     </Field>
    //   </fieldset>
    //   <div className="flex w-full justify-end">
    //     {isEditMode ? (
    //       <div className="flex gap-3">
    //         <Button type="submit" size="large" appearance="primary">
    //           Сохранить
    //         </Button>
    //         <Button
    //           type="button"
    //           size="large"
    //           appearance="secondary"
    //           onClick={() => setIsEditMode(!isEditMode)}
    //         >
    //           Отмена
    //         </Button>
    //       </div>
    //     ) : (
    //       <Button
    //         type="button"
    //         appearance="primary"
    //         size="large"
    //         onClick={() => setIsEditMode(!isEditMode)}
    //       >
    //         Редактировать
    //       </Button>
    //     )}
    //   </div>
    // </CustomForm>
  );
}
