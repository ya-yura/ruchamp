type TypeCustomCardProps = {
  title?: string;
  text: string;
};

export function TextCard({ title, text }: TypeCustomCardProps) {
  return (
    <div className="flex flex-col items-start rounded-lg bg-[#292929] px-6 py-8">
      {title && <h4 className="mb-3 text-xl font-semibold">{title}</h4>}
      <p className="whitespace-pre-line text-sm text-[#999999]">{text}</p>
    </div>
  );
}
