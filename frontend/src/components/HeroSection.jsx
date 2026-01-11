import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand/5 to-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[1.1fr,0.9fr] md:items-center">
        <div className="flex flex-col gap-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
            Trusted professionals • Verified reviews
          </span>
          <h1 className="text-4xl font-semibold text-slate-900 md:text-5xl">
            Everything you need to keep life running smoothly.
          </h1>
          <p className="text-lg text-slate-600">
            Search, compare, and book verified local experts for cleaning, repairs, beauty, wellness, and more. Instant availability, transparent pricing, and secure payments in one place.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/services" className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-brand-dark">
              Explore services
            </Link>
            <Link to="/provider" className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand hover:text-brand">
              Become a provider
            </Link>
          </div>
          <dl className="grid grid-cols-2 gap-6 pt-4 sm:grid-cols-3">
            {[
              { label: 'Active customers', value: '50K+' },
              { label: 'Certified providers', value: '12K' },
              { label: 'Cities covered', value: '35' }
            ].map((item) => (
              <div key={item.label}>
                <dt className="text-xs uppercase tracking-wide text-slate-500">{item.label}</dt>
                <dd className="text-2xl font-semibold text-slate-900">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative">
          <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-brand/20 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-10 -right-8 h-32 w-32 rounded-full bg-brand/20 blur-3xl" aria-hidden="true" />
          <div className="relative w-full rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-800">Book a home cleaner</span>
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">45 mins</span>
            </div>
            <ul className="mt-6 space-y-4">
              {[
                {
                  title: 'Deep cleaning',
                  subtitle: '2 professionals • Starting at $79',
                  status: 'Available today'
                },
                {
                  title: 'Move-out cleaning',
                  subtitle: '3 professionals • Starting at $119',
                  status: '3 slots left'
                },
                {
                  title: 'Appliance maintenance',
                  subtitle: 'On-demand • Certified technicians',
                  status: 'New'
                }
              ].map((slot) => (
                <li key={slot.title} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{slot.title}</p>
                    <p className="text-xs text-slate-500">{slot.subtitle}</p>
                  </div>
                  <span className="text-xs font-medium text-brand">{slot.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
