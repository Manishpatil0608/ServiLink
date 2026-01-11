import { Link } from 'react-router-dom';

const CATEGORIES = [
  { name: 'Home Cleaning', description: 'Deep cleans, housekeeping, move-in/out packages', icon: '🧹', filter: 'Cleaning' },
  { name: 'Repairs & Maintenance', description: 'Electricians, plumbers, appliance technicians', icon: '🔧', filter: 'Repairs' },
  { name: 'Beauty & Wellness', description: 'Salon at home, grooming, spa treatments', icon: '💆', filter: 'Beauty' },
  { name: 'Events & Decor', description: 'Photographers, decorators, catering partners', icon: '🎉', filter: 'Business' },
  { name: 'Tutoring & Coaching', description: 'Academic tutors, music teachers, language coaches', icon: '📚', filter: 'Tutoring' },
  { name: 'Business Services', description: 'Accounting, IT support, facility management', icon: '🏢', filter: 'Business' }
];

const CategoryShowcase = () => {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold text-slate-900">Explore 40+ service categories curated for every need.</h2>
          <p className="mt-3 text-slate-600">Discover carefully vetted professionals with upfront pricing, quality checks, and instant booking guarantees.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => (
            <Link
              key={category.name}
              to={`/services${category.filter ? `?category=${encodeURIComponent(category.filter)}` : ''}`}
              className="group flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-brand/50 hover:shadow-xl"
            >
              <span className="text-3xl" aria-hidden="true">{category.icon}</span>
              <h3 className="text-lg font-semibold text-slate-900">{category.name}</h3>
              <p className="text-sm text-slate-500">{category.description}</p>
              <span className="text-sm font-medium text-brand/80 group-hover:text-brand">View specialists →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
