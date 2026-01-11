const STEPS = [
  {
    step: '01',
    title: 'Tell us what you need',
    description: 'Answer a few guided questions so we can match you with the best suited professionals.'
  },
  {
    step: '02',
    title: 'Compare & confirm',
    description: 'Review profiles, availability, pricing, and verified reviews before booking securely.'
  },
  {
    step: '03',
    title: 'Relax & track progress',
    description: 'Get real-time updates, pay after completion, and rate your experience to keep standards high.'
  }
];

const BookingProcess = () => {
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6">
        <header className="max-w-2xl">
          <h2 className="text-3xl font-semibold text-slate-900">Book in three guided steps.</h2>
          <p className="mt-3 text-slate-600">Our concierge flow keeps everything transparent with live updates, secure payments, and post-service support.</p>
        </header>
        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map((item) => (
            <article key={item.step} className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">{item.step}</span>
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="text-sm text-slate-500">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookingProcess;
