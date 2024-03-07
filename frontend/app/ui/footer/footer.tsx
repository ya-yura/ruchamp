import { Text } from '@fluentui/react-components';
import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full h-14 px-4 bg-black flex flex-row items-center justify-between">
      <Text>Это footer</Text>
      <Link href="/">
        <Image
          src="/logo.svg"
          alt="Логотип РуЧамп"
          // className="dark:invert"
          width={100}
          height={24}
          priority
        />
      </Link>
    </footer>
  );
}
