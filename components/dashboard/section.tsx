interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export function Section({ title, children }: SectionProps) {
  return (
    <section className="mt-8">
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}
