import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="absolute top-0 left-0 h-screen w-full bg-[#0A0A0A]">
      <Image
        className="relative opacity-50"
        src="/ru/images/background-auth.jpeg"
        alt={'ДОБАВИТЬ ОПИСАНИЕ'}
        fill={true}
        style={{ objectFit: 'cover' }}
      />
      {children}
    </main>
  );
}
