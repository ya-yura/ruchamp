'use client';

import React, { Dispatch, ReactNode, SetStateAction, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Form } from '../ui/form';
import { CustomForm } from '../forms/custom-form';
import { UseFormReturn, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CustomFieldset, TypeFieldsetData } from '../forms/custom-fieldset';
import { toast } from 'sonner';
import { Spinner } from '../spinner';
import { useRouter } from 'next/navigation';
import { Locale } from '@/i18n.config';
import { RangeSlider } from '@/app/[lang]/(unprotected)/teams/range-slider';

const toNumber = (val: unknown) => {
  const num = Number(val);
  if (isNaN(num)) {
    throw new Error('Invalid number');
  }
  return num;
};

export const createMatchSchema = z.object({
  name: z.string().min(1, 'Это обязательное поле'),
  start_datetime: z.string().min(1, 'Это обязательное поле'),
  nominal_time: z.string().min(1, 'Это обязательное поле'),
  sport_type: z.string().min(1, 'Это обязательное поле'),
  combat_type: z.string().min(1, 'Это обязательное поле'),
  grade: z.string().min(1, 'Это обязательное поле'),
  gender: z.string().min(1, 'Это обязательное поле'),
  age_category: z.string().min(1, 'Это обязательное поле'),
  age_min: z.preprocess((val) => toNumber(val), z.number()),
  age_max: z.preprocess((val) => toNumber(val), z.number()),
  weight_category: z.string().min(1, 'Это обязательное поле'),
  weight_min: z.preprocess((val) => toNumber(val), z.number()),
  weight_max: z.preprocess((val) => toNumber(val), z.number()),
  mat_vol: z.preprocess((val) => toNumber(val), z.number()),
  price: z.preprocess((val) => toNumber(val), z.number()),
  seat_capacity: z.preprocess((val) => toNumber(val), z.number()),
  price_athlete: z.preprocess((val) => toNumber(val), z.number()),
});

export type CreateMatchSchema = z.infer<typeof createMatchSchema>;

const CreateMatchFields: Record<string, Partial<keyof CreateMatchSchema>[]> = {
  1: ['name', 'start_datetime', 'nominal_time'],
  2: [
    'sport_type',
    'gender',
    'age_min',
    'age_max',
    'age_category',
    'weight_min',
    'weight_max',
    'weight_category',
    'grade',
    'combat_type',
  ],
  3: ['mat_vol', 'price', 'seat_capacity', 'price_athlete'],
};

const CreateMatchTabs: Record<string, string> = {
  1: 'Название и время',
  2: 'Критерии',
  3: 'Проведение и билеты',
};
interface CreateMatchDialogProps {
  token?: string;
  sportTypes: string[];
  lang: Locale;
  className?: string;
}

export function CreateMatchDialog({
  token,
  sportTypes,
  lang,
  className,
}: CreateMatchDialogProps) {
  const [tabValue, setTabValue] = useState<string>('1');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ages, setAges] = useState<number[]>([]);
  const [weights, setWeights] = useState<number[]>([]);

  const router = useRouter();

  const weightRange = [20, 150];
  const ageRange = [3, 100];
  const weightDefaults = [50, 70];
  const ageDefaults = [15, 30];

  const form = useForm<CreateMatchSchema>({
    resolver: zodResolver(createMatchSchema),
    defaultValues: {
      name: '',
      start_datetime: '',
      nominal_time: '',
      sport_type: '',
      combat_type: '',
      grade: '',
      gender: '',
      age_category: '',
      age_min: ageDefaults[0],
      age_max: ageDefaults[1],
      weight_category: '',
      weight_min: weightDefaults[0],
      weight_max: weightDefaults[1],
      mat_vol: 0,
      price: 0,
      seat_capacity: 0,
      price_athlete: 0,
    },
  });

  const title = form.watch('name');

  function handleTabChange(value: -1 | 1) {
    setTabValue((prevVal) => Math.max(+prevVal + value, 1).toString());
  }

  async function handleNextClick() {
    const output = await form.trigger(CreateMatchFields[tabValue]);
    if (output) {
      handleTabChange(1);
    }
  }

  function onSubmit(values: CreateMatchSchema): void {
    // setIsLoading(true);
    if (token) {
      console.log(values);
      //   createEvent(token, values)
      //     .then((id) => {
      //       setIsOpen(false);
      //       toast.success(
      //         'Событие успешно создано. Вы будете перенаправлены на него',
      //       );
      //       revalidateEvents();
      //       form.reset();
      //       router.push(path(lang, `/event/${id}/info`));
      //     })
      //     .catch((err) => {
      //       console.log('Ошибка при создании события: ', err);
      //       toast.error('Что-то пошло не так');
      //     })
      //     .finally(() => setIsLoading(false));
    }
  }

  const CreateMatchTabsContent: Record<
    keyof typeof CreateMatchTabs,
    ReactNode
  > = {
    1: <NameFieldset form={form} />,
    2: (
      <MatchCriteriaFieldset
        form={form}
        sportTypes={sportTypes}
        ages={ages}
        setAges={setAges}
        weights={weights}
        setWeights={setWeights}
        weightDefaults={weightDefaults}
        ageDefaults={ageDefaults}
        weightRange={weightRange}
        ageRange={ageRange}
      />
    ),
    3: <TicketsFieldset form={form} />,
  };

  return (
    <Dialog onOpenChange={(open: boolean) => setIsOpen(!isOpen)} open={isOpen}>
      <DialogTrigger asChild>
        <Button className={cn(className)} variant={'ruchampDefault'}>
          Создать мероприятие
        </Button>
      </DialogTrigger>
      <DialogContent className="top-[25%] h-fit w-[752px] max-w-[752px] translate-y-[0]">
        <DialogHeader className="absolute left-0 right-0 top-[-92px] flex flex-col">
          <DialogTitle>{title ? title : 'Мероприятие'}</DialogTitle>
        </DialogHeader>
        <Tabs className="relative mx-auto w-full" value={tabValue}>
          <div className="absolute top-[-60px] flex h-[36px] w-full">
            <TabsList className="mx-auto flex h-auto w-fit flex-col justify-between gap-3 bg-transparent text-[#D6D6D6] sm:flex-row lg:w-fit">
              {Object.entries(CreateMatchTabs).map(([key, value]) => (
                <TabsTrigger className="cursor-default" key={key} value={key}>
                  {value}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <Form {...form}>
            <CustomForm
              onSubmit={form.handleSubmit(onSubmit)}
              className="dark h-fit justify-start bg-transparent py-0 sm:w-full sm:px-3 sm:py-0"
            >
              {Object.entries(CreateMatchTabsContent).map(([key, value]) => (
                <TabsContent key={key} value={key}>
                  {value}
                </TabsContent>
              ))}
              <DialogFooter>
                <div className="absolute bottom-[-86px] right-[-24px] flex gap-3">
                  {tabValue !== '1' && (
                    <Button
                      className="text-white"
                      type="button"
                      variant={'ruchampTransparentGreyBorder'}
                      onClick={() => handleTabChange(-1)}
                    >
                      Назад
                    </Button>
                  )}

                  {+tabValue === Object.keys(CreateMatchTabs).length ? (
                    <Button
                      className="text-white"
                      variant={'ruchampDefault'}
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading && <Spinner className="h-6 w-6" />}
                      Создать
                    </Button>
                  ) : (
                    <Button
                      className="text-white"
                      type="button"
                      variant={'ruchampDefault'}
                      disabled={false}
                      onClick={handleNextClick}
                    >
                      Далее
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </CustomForm>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function NameFieldset({ form }: { form: UseFormReturn<CreateMatchSchema> }) {
  const timeSelectOptions = Array.from({ length: 20 }, (_, index) => {
    const res = `${(index + 1) * 10} минут`;
    return {
      value: res,
      option: res,
    };
  });

  const nameFieldsetData: TypeFieldsetData<CreateMatchSchema> = {
    fields: [
      {
        type: 'text',
        name: 'name',
        placeholder: 'Название мероприятия',
        label: 'Название',
      },
      {
        type: 'datetime-local',
        name: 'start_datetime',
        placeholder: 'Начало',
        label: 'Начало',
      },
      {
        type: 'select',
        name: 'nominal_time',
        placeholder: 'Выберите время',
        label: 'Номинальное время проведения одного соревнования',
        fieldStyles: 'w-fit',
        inputStyles: 'w-fit',
        selectOptions: timeSelectOptions,
      },
    ],
  };

  return (
    <CustomFieldset<CreateMatchSchema>
      form={form}
      fieldsetData={nameFieldsetData}
    />
  );
}

interface MatchCriteriaFieldsetProps {
  form: UseFormReturn<CreateMatchSchema>;
  sportTypes: string[];
  ages: number[];
  setAges: Dispatch<SetStateAction<number[]>>;
  weights: number[];
  setWeights: Dispatch<SetStateAction<number[]>>;
  weightDefaults: number[];
  ageDefaults: number[];
  weightRange: number[];
  ageRange: number[];
}

function MatchCriteriaFieldset({
  form,
  sportTypes,
  ages,
  setAges,
  weights,
  setWeights,
  weightDefaults,
  ageDefaults,
  weightRange,
  ageRange,
}: MatchCriteriaFieldsetProps) {
  const sportSelectOptions = sportTypes.map((option) => ({
    value: option,
    option: option,
  }));
  const gradeSelectOptions = [
    {
      value: '1',
      option: 'МС',
    },
    {
      value: '2',
      option: 'КМС',
    },
  ];

  const combatSelectOptions = [
    {
      value: 'Олимпийская',
      option: 'Олимпийская',
    },
  ];

  const basicFieldsetData: TypeFieldsetData<CreateMatchSchema> = {
    fields: [
      {
        type: 'select',
        name: 'sport_type',
        placeholder: 'Выберите из списка',
        label: 'Вид спорта',
        fieldStyles: 'col-span-6',
        selectOptions: sportSelectOptions,
      },
      {
        type: 'select',
        name: 'gender',
        placeholder: 'Выберите значение',
        label: 'Пол участников',
        fieldStyles: 'col-span-6',
        selectOptions: [
          {
            value: 'Мужской',
            option: 'Мужской',
          },
          {
            value: 'Женский',
            option: 'Женский',
          },
        ],
      },
      {
        type: 'select',
        name: 'grade',
        placeholder: 'Выберите из списка',
        label: 'Уровень спортсменов',
        fieldStyles: 'col-span-6',
        selectOptions: gradeSelectOptions,
      },
      {
        type: 'select',
        name: 'combat_type',
        placeholder: 'Выберите из списка',
        label: 'Схема боёв',
        fieldStyles: 'col-span-6',
        selectOptions: combatSelectOptions,
      },
      {
        type: 'text',
        name: 'age_category',
        placeholder: 'Например, "Юниоры"',
        label: 'Возрастная категория',
        fieldStyles: 'flex-row items-center',
      },
    ],
  };

  const weightFieldsetData: TypeFieldsetData<CreateMatchSchema> = {
    fields: [
      {
        type: 'text',
        name: 'weight_category',
        placeholder: 'Например, "Суперлёгкий"',
        label: 'Весовая категория',
        fieldStyles: 'flex-row items-center',
      },
    ],
  };

  return (
    <>
      <CustomFieldset<CreateMatchSchema>
        className="mb-5 sm:gap-x-14 sm:gap-y-10"
        form={form}
        fieldsetData={basicFieldsetData}
      />
      <RangeSlider
        className="mb-12"
        title={'Возраст (лет)'}
        defaultValue={ageDefaults}
        minValue={ageRange[0]}
        maxValue={ageRange[1]}
        minStepsBetweenThumbs={1}
        value={ages}
        setValue={(ages) => {
          const newAges = ages as number[];
          form.setValue('age_min', newAges[0]);
          form.setValue('age_max', newAges[1]);
          setAges(newAges);
        }}
      />
      <CustomFieldset<CreateMatchSchema>
        className="mb-5"
        form={form}
        fieldsetData={weightFieldsetData}
      />
      <RangeSlider
        className=""
        title={'Вес (кг)'}
        defaultValue={weightDefaults}
        minValue={weightRange[0]}
        maxValue={weightRange[1]}
        minStepsBetweenThumbs={1}
        value={weights}
        setValue={(weights) => {
          const newWeights = weights as number[];
          form.setValue('weight_min', newWeights[0]);
          form.setValue('weight_max', newWeights[1]);
          setWeights(newWeights);
        }}
      />
    </>
  );
}

function TicketsFieldset({ form }: { form: UseFormReturn<CreateMatchSchema> }) {
  const docsFieldsetData: TypeFieldsetData<CreateMatchSchema> = {
    fields: [
      {
        type: 'number',
        name: 'price_athlete',
        placeholder: 'Введите стоимость',
        label: 'Стоимость участия, руб',
        fieldStyles: 'col-start-1 col-end-6',
      },
      {
        type: 'number',
        name: 'mat_vol',
        placeholder: 'Введите количество матов/арен',
        label: 'Количество матов/арен',
        fieldStyles: 'col-start-1 col-end-6',
      },
      {
        type: 'number',
        name: 'price',
        placeholder: 'Введите стоимость',
        label: 'Стоимость билета для зрителей, руб',
        fieldStyles: 'col-start-1 col-end-6',
      },
      {
        type: 'number',
        name: 'seat_capacity',
        placeholder: 'Введите количество мест',
        label: 'Количество мест для зрителей',
        fieldStyles: 'col-start-1 col-end-6',
      },
    ],
  };

  return (
    <>
      <CustomFieldset<CreateMatchSchema>
        form={form}
        fieldsetData={docsFieldsetData}
      />
      <p className="absolute bottom-7 right-0 w-[56%] text-xs leading-[20px] text-NeutralBackground4Rest sm:text-sm">
        Если у вас несколько мероприятий подряд и вы рассчитываете провести их
        для зрителей за один сеанс, то указывайте стоимость и количество мест
        только для первого мероприятия по времени, а за следующие мероприятия
        устанавливайте их равными нулю.
      </p>
    </>
  );
}
