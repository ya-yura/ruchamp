type TypeGreetingsProps = {
  title: string;
  subtitle: string;
};

export function Greetings({ title, subtitle }: TypeGreetingsProps) {
  return (
    <div className="flex flex-col justify-center gap-2 text-[#E0E0E0] sm:gap-6 p-3 lg:self-start mb-4 lg:mb-0">
      <h1 className="text-2xl font-bold text-background text-center sm:text-5xl lg:text-left">
        {title}
      </h1>
      <p className="text-[1rem] leading-5 text-background text-xs sm:text-base text-center lg:text-left">
        {subtitle}
      </p>
    </div>
  );
}
