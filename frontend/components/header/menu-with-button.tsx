import Link from 'next/link';
import { HomeIcon, ListIcon, MenuIcon } from '../icons';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetOverlay, SheetTrigger } from '../ui/sheet';
import { Separator } from '../ui/separator';

type TypeMenuItem = {
  icon: React.ReactNode;
  text: string;
  url: string;
};

export function MenuWithButton() {
  const menuMain: TypeMenuItem[] = [
    {
      icon: <HomeIcon className="fill-[#E0E0E0]" />,
      text: 'Главная',
      url: '/ru',
    },
    {
      icon: <ListIcon className="fill-[#E0E0E0]" />,
      text: 'Мероприятия',
      url: '/ru/events',
    },
    {
      icon: <HomeIcon className="fill-[#E0E0E0]" />,
      text: 'Пятое',
      url: '/ru',
    },
    {
      icon: <HomeIcon className="fill-[#E0E0E0]" />,
      text: 'Десятое',
      url: '/ru',
    },
    {
      icon: <HomeIcon className="fill-[#E0E0E0]" />,
      text: 'Общее',
      url: '/ru',
    },
  ];
  const menuAdditional: TypeMenuItem[] = [
    {
      icon: <HomeIcon className="fill-[#E0E0E0]" />,
      text: 'Профиль',
      url: '/ru/profile',
    },
    {
      icon: <ListIcon className="fill-[#E0E0E0]" />,
      text: 'Мои мероприятия',
      url: '/ru/events',
    },
    {
      icon: <HomeIcon className="fill-[#E0E0E0]" />,
      text: 'Прочее',
      url: '/ru',
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="sm:hidden"
          variant="ruchampTransparentGreyBorder"
          size="icon"
        >
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetOverlay className="bg-lightgray/50">
        <SheetContent
          className="top-16 h-fit w-3/4 max-w-[330px] rounded-e-xl border-r-0 bg-black p-8"
          side="left"
        >
          <nav>
            <ul className="flex flex-col gap-3">
              {menuMain.map((item) => (
                <li key={item.text}>
                  <Link
                    className="flex w-fit items-center gap-3"
                    href={item.url}
                  >
                    {item.icon}
                    <p className="text-white">{item.text}</p>
                  </Link>
                </li>
              ))}
              <Separator className="my-3 bg-[#3D3D3D]" />
              {menuAdditional.map((item) => (
                <li key={item.text}>
                  <Link
                    className="flex w-fit items-center gap-3"
                    href={item.url}
                  >
                    {item.icon}
                    <p className="text-white">{item.text}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </SheetContent>
      </SheetOverlay>
    </Sheet>
  );
}
