type TypeGreetingsProps = {
  title: string;
  subtitle: string;
};

export function Greetings({ title, subtitle }: TypeGreetingsProps) {
  return (
    <div className="flex w-1/2 items-center justify-center">
      <div className="flex w-3/5 flex-col gap-6 text-[#E0E0E0]">
        <h1 className="text-5xl font-bold text-background">{title}</h1>
        <p className="text-base text-background">{subtitle}</p>
      </div>
    </div>
  );
}
