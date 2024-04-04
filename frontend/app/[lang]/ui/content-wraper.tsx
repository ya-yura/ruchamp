export function ContentWraper({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex w-full max-w-7xl flex-col justify-between mx-auto ${className}`}
    >
      {children}
    </div>
  );
}
