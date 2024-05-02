import { Dispatch, SetStateAction } from 'react';

export function switchTitle(
  step: 1 | 2 | 3 | 4,
  setter: Dispatch<SetStateAction<{ title: string; subtitle: string }>>,
) {
  switch (step) {
    case 1:
      setter({
        title: 'Привет!',
        subtitle: 'Это страница регистрации.',
      });
      break;
    case 2:
      setter({
        title: 'Выберите роль',
        subtitle: 'От выбранной роли будут зависеть возможности системы.',
      });
      break;
    case 3:
      setter({
        title: 'Опишите себя',
        subtitle: 'От введённой информации будут зависеть возможности системы.',
      });
      break;
    case 4:
      setter({
        title: 'Опишите себя',
        subtitle: 'От введённой информации будут зависеть возможности системы.',
      });
      break;
  }
}
