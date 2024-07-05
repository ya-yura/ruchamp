type TypeGreetingsProps = {
  title: string;
  subtitle: string;
};

export function Greetings({ title, subtitle }: TypeGreetingsProps) {
  return (
    <div className="flex flex-col min-[769px]:items-start gap-2 sm:gap-6 justify-center text-[#E0E0E0] max-[769px]:items-center max-[769px]:w-1/4 max-[769px]:w-6/12 max-[475px]:w-5/6">
        <h1 className="text-2xl sm:text-5xl font-bold text-background text-center">{title}</h1>
        <p className="text-[1rem] leading-5 sm:text-base text-background text-center max-[475px]:text-xs max-[769px]:text-nowrap max-[475px]:text-balance">{subtitle}</p>
    </div>
  );
}
