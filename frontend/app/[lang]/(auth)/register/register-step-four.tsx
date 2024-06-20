import {
  CustomFieldset,
  TypeFieldsetData,
} from '@/components/forms/custom-fieldset';
import { Country, EnumUserRole, AllRegions } from '@/lib/definitions';
import { UseFormReturn } from 'react-hook-form';
import { TypeRegFormSchema } from './register-form';
import { Locale } from '@/i18n.config';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/spinner';
import { ButtonsBlock } from '@/components/auth/buttons-block';

type TypeRegisterStepFourProps = {
  form: UseFormReturn<TypeRegFormSchema>;
  lang: Locale;
  switchStep: (num: 1 | 2 | 3 | 4) => void;
  isLoading: boolean;
  errorMessage: string;
  sportTypes: string[];
};

const getCountryOptions = () => {
  return Object.keys(Country)
    .filter((key) => isNaN(Number(key))) // Only get the string keys
    .map((key) => ({
      value: Country[key as keyof typeof Country].toString(),
      option: key,
    }));
};

const getRegionOptions = () => {
  return Object.keys(AllRegions)
    .filter((key) => isNaN(Number(key))) // Only get the string keys
    .map((key) => ({
      value: AllRegions[key as keyof typeof AllRegions].toString(),
      option: key,
    }));
};

const countryOptions = getCountryOptions();
const regionOptions = getRegionOptions();

export function RegisterStepFour({
  form,
  lang,
  switchStep,
  isLoading,
  errorMessage,
  sportTypes,
}: TypeRegisterStepFourProps) {
  const values = form.getValues();
  const userValues = values.user_create;
  const infoValues = values.user_data.info;
  const userRoleId = userValues.role_id;

  const regAthleteFieldset: TypeFieldsetData<TypeRegFormSchema> = {
    fields: [
      {
        type: 'select',
        name: 'user_data.info.athlete_country',
        placeholder: 'Выберите из списка',
        label: 'Страна',
        defaultValue: '',
        selectOptions: countryOptions,
      },
      {
        type: 'select',
        name: 'user_data.info.athlete_region',
        placeholder: 'Выберите из списка',
        label: 'Регион',
        defaultValue: '',
        selectOptions: regionOptions,
      },
      {
        type: 'text',
        name: 'user_data.info.athlete_city',
        placeholder: 'Ваш город',
        label: 'Город',
        defaultValue: '',
      },
      {
        type: 'text',
        name: 'user_data.info.athlete_height',
        placeholder: 'Ваш рост',
        label: 'Рост',
        defaultValue: '',
      },
      {
        type: 'text',
        name: 'user_data.info.athlete_weight',
        placeholder: 'Ваш вес',
        label: 'Вес',
        defaultValue: '',
      },
      {
        type: 'multiselect',
        name: 'user_data.info.athlete_sport_type',
        placeholder: 'Выберите из списка',
        label: 'Виды спорта',
        defaultValue: '',
        multiselectOptions: sportTypes,
      },
    ],
  };

  const regOrganizerFieldset: TypeFieldsetData<TypeRegFormSchema> = {
    fields: [
      {
        type: 'text',
        name: 'user_data.info.event_organizer_organization_name',
        placeholder: 'Название вашей организации',
        label: 'Организация',
        defaultValue: '',
      },
      {
        type: 'text',
        name: 'user_data.info.event_organizer_organization_website',
        placeholder: 'https://',
        label: 'Сайт организации',
        defaultValue: '',
      },
      {
        type: 'text',
        name: 'user_data.info.event_organizer_organization_contact_email',
        placeholder: 'Электронный адрес компании',
        label: 'Электронный адрес компании',
        defaultValue: '',
      },
      {
        type: 'tel',
        name: 'user_data.info.event_organizer_organization_contact_phone',
        placeholder: 'Контактный телефон компании',
        label: 'Телефон компании',
        defaultValue: '',
      },
    ],
  };

  const regSpectatorFieldset: TypeFieldsetData<TypeRegFormSchema> = {
    fields: [
      {
        type: 'tel',
        name: 'user_data.info.spectator_phone_number',
        placeholder: 'Ваш телефон',
        label: 'Телефон',
        defaultValue: '',
      },
    ],
  };

  const regRefereeFieldset: TypeFieldsetData<TypeRegFormSchema> = {
    fields: [
      {
        type: 'select',
        name: 'user_data.info.referee_qualification_level',
        placeholder: 'Выберите из списка',
        label: 'Ваша категория',
        defaultValue: '',
        selectOptions: [
          { value: '10', option: 'Начинающий судья' },
          { value: '3', option: 'Судья 3-й категории' },
          { value: '2', option: 'Судья 2-й категории' },
          { value: '1', option: 'Судья 1-й категории' },
          { value: '4', option: 'Международный судья' },
        ],
      },
    ],
  };

  const fields: Record<EnumUserRole, TypeFieldsetData<TypeRegFormSchema>> = {
    [EnumUserRole.athlete]: regAthleteFieldset,
    [EnumUserRole.organizer]: regOrganizerFieldset,
    [EnumUserRole.spectator]: regSpectatorFieldset,
    [EnumUserRole.referee]: regRefereeFieldset,
  };

  const isButtonDisabled = (): boolean => {
    switch (userRoleId) {
      case '1':
        return !(
          infoValues.athlete_country &&
          infoValues.athlete_region &&
          infoValues.athlete_city &&
          infoValues.athlete_height &&
          infoValues.athlete_weight
        );
      case '2':
        return !(
          infoValues.event_organizer_organization_contact_email &&
          infoValues.event_organizer_organization_contact_phone &&
          infoValues.event_organizer_organization_name &&
          infoValues.event_organizer_organization_website
        );
      case '3':
        return !infoValues.spectator_phone_number;
      case '5':
        return !infoValues.referee_qualification_level;
      default:
        return false;
    }
  };

  return (
    <>
      <CustomFieldset
        form={form}
        lang={lang}
        fieldsetData={fields[userRoleId]}
        errorMessage={errorMessage}
      />
      <ButtonsBlock>
        <Button
          className="w-full text-foreground sm:w-auto"
          size="lg"
          type="button"
          variant="ruchampTransparentGreyBorder"
          onClick={() => switchStep(3)}
        >
          Назад
        </Button>
        <Button
          className="flex w-full gap-3 px-9 sm:w-auto"
          variant="ruchampDefault"
          type="submit"
          size="lg"
          disabled={isLoading || isButtonDisabled()}
        >
          {isLoading && <Spinner className="h-6 w-6" />}
          Зарегистрироваться
        </Button>
      </ButtonsBlock>
    </>
  );
}
