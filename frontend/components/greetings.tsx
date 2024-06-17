type TypeGreetingsProps = {
  title: string;
  subtitle: string;
};

export function Greetings({ title, subtitle }: TypeGreetingsProps) {
  return (
    <div className="flex items-center justify-center mt-[60px] mb-[10px] sm:mt-0 sm:mb-0">
      <div className="flex w-3/5 flex-col gap-2 sm:gap-6 text-[#E0E0E0]">
        <h1 className="text-2xl sm:text-5xl font-bold text-background text-center md:text-start">{title}</h1>
        <p className="text-[1rem] leading-5 sm:text-base text-background text-center md:text-start">{subtitle}</p>
      </div>
    </div>
  );
}
