type TypeCustomFormProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
};

export function CustomForm({
  onSubmit,
  children,
}: TypeCustomFormProps) {
  return (
    <form
      className="relative my-auto flex h-fit w-auto flex-col justify-evenly rounded-md bg-white px-9 py-7"
      onSubmit={onSubmit}
    >
      {children}
    </form>
  );
}
