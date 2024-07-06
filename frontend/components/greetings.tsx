type TypeGreetingsProps = {
  title: string;
  subtitle: string;
};

export function Greetings({ title, subtitle }: TypeGreetingsProps) {
  return (
    <div className="flex flex-col justify-center gap-2 text-[#E0E0E0] max-[769px]:mb-10 max-[769px]:w-1/2 max-[769px]:items-center max-[475px]:w-5/6 sm:gap-6 min-[769px]:items-start ">
      <h1 className="text-left text-2xl font-bold text-background max-[768px]:text-center sm:text-5xl">
        {title}
      </h1>
      <p className="w-full text-left text-[1rem] leading-5 text-background max-[768px]:text-center max-[475px]:text-balance max-[475px]:text-xs sm:text-base">
        {subtitle}
      </p>
    </div>
  );
}
