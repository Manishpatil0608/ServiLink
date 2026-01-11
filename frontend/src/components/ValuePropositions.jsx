const VALUE_PROPS = [
  {
    title: 'Verified professionals only',
    description: 'Each provider passes multi-layer identity, qualification, and background checks before listing services.'
  },
  {
    title: 'Realtime availability',
    description: 'See live calendars, secure slots instantly, and receive reminders with smart rescheduling options.'
  },
  {
    title: 'Transparent pricing',
    description: 'Fixed-price packages with detailed scopes. No hidden fees, guaranteed refunds, and secure escrow payments.'
  }
];

const ValuePropositions = () => {
  return (
    <section className="bg-slate-900 py-16 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6">
        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-light">Why ServiLink</p>
          <h2 className="mt-2 text-3xl font-semibold">Trusted by 50,000+ households and growing every day.</h2>
        </header>
        <div className="grid gap-6 md:grid-cols-3">
          {VALUE_PROPS.map((prop) => (
            <article key={prop.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur transition hover:border-brand-light/60">
              <h3 className="text-lg font-semibold">{prop.title}</h3>
              <p className="mt-3 text-sm text-slate-200">{prop.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuePropositions;
