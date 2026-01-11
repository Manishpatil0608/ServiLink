const TESTIMONIALS = [
  {
    name: 'Neha Sharma',
    role: 'Interior Designer, Mumbai',
    quote: 'ServiLink helped us onboard a verified cleaning crew in minutes. The scheduling flow and wallet made repeat bookings super easy.'
  },
  {
    name: 'Rahul Jain',
    role: 'Startup Founder, Pune',
    quote: 'We rely on ServiLink for office maintenance. I love the transparent pricing and responsive support team.'
  },
  {
    name: 'Ananya Bhat',
    role: 'Working Parent, Bengaluru',
    quote: 'The provider verification gives me peace of mind. Real-time updates meant I could manage bookings even on busy days.'
  }
];

const Testimonials = () => {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6">
        <header className="max-w-xl">
          <h2 className="text-3xl font-semibold text-slate-900">Loved by households and teams across India.</h2>
          <p className="mt-3 text-slate-600">We obsess over quality. Each review is verified, and every service gets an NPS score to keep standards high.</p>
        </header>
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <article key={item.name} className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <p className="text-sm text-slate-600">“{item.quote}”</p>
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">{item.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
