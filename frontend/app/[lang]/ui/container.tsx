export function Container({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-[calc(100vh-137px)] flex-col items-center justify-start bg-[#0a0a0a] pt-3">
      {children}
    </main>
  );
}
