export function ContentWraper({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex w-full max-w-7xl flex-col mx-auto ${className}`}
    >
      {children}
    </div>
  );
}
