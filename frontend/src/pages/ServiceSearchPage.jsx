import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../components/PageHeader.jsx';
import { fetchServiceCategories, fetchServices } from '../services/catalogService.js';

const ServiceSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categorySlug = searchParams.get('category') ?? '';

  const categoriesQuery = useQuery({
    queryKey: ['serviceCategories'],
    queryFn: fetchServiceCategories
  });

  const servicesQuery = useQuery({
    queryKey: ['services', categorySlug],
    queryFn: () => fetchServices({
      categorySlug: categorySlug || undefined,
      page: 1,
      pageSize: 12
    }),
    keepPreviousData: true
  });

  const categories = useMemo(() => {
    const list = categoriesQuery.data ?? [];
    return [{ name: 'All', slug: '' }, ...list.map((category) => ({ name: category.name, slug: category.slug }))];
  }, [categoriesQuery.data]);

  const activeCategorySlug = categories.some((category) => category.slug === categorySlug)
    ? categorySlug
    : '';

  const services = servicesQuery.data?.data ?? [];

  const formatPrice = (amount, unit) => {
    if (amount === null || amount === undefined) {
      return 'Pricing on request';
    }
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
    if (unit === 'per_hour') {
      return `${formatted} / hour`;
    }
    if (unit === 'per_day') {
      return `${formatted} / day`;
    }
    return formatted;
  };

  const updateCategory = (slug) => {
    if (!slug) {
      setSearchParams({}, { replace: true });
      return;
    }
    setSearchParams({ category: slug }, { replace: true });
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <PageHeader
        title="Explore services near you"
        description="Filter by category, price, and availability. Every listing is verified and backed by the ServiLink assurance."
        actions={(
          <div className="flex flex-wrap gap-2">
            <button type="button" className="rounded-full border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-brand hover:text-brand">Filters</button>
            <button type="button" className="rounded-full border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-brand hover:text-brand">Sort</button>
            <button type="button" className="rounded-full border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-brand hover:text-brand">Saved searches</button>
          </div>
        )}
      />

      <section className="mt-8 flex flex-wrap gap-3">
        {categories.map((category) => {
          const isActive = category.slug === activeCategorySlug;
          return (
            <button
              key={category.slug}
              type="button"
              onClick={() => updateCategory(category.slug)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${isActive ? 'bg-brand text-white shadow-sm' : 'border border-slate-200 bg-slate-50 text-slate-600 hover:border-brand hover:text-brand'}`}
            >
              {category.name}
            </button>
          );
        })}
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        {servicesQuery.isLoading ? (
          <p className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">Loading services…</p>
        ) : null}

        {servicesQuery.isError ? (
          <p className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">Unable to load services right now. Please try again shortly.</p>
        ) : null}

        {!servicesQuery.isLoading && !servicesQuery.isError && services.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-xs text-slate-500">
            No services found in this category yet. Try exploring another category or adjust your filters.
          </p>
        ) : null}

        {services.map((service) => (
          <article key={service.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <header className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">{service.title}</h2>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                {service.provider.ratingAverage ? `${service.provider.ratingAverage.toFixed(1)}★` : 'New'}
              </span>
            </header>
            <p className="mt-1 text-xs text-slate-500">
              {service.provider.totalReviews ? `${service.provider.totalReviews} verified reviews` : 'Awaiting reviews'}
            </p>
            <p className="mt-4 text-2xl font-semibold text-slate-900">{formatPrice(service.basePrice, service.priceUnit)}</p>
            <p className="mt-4 text-sm text-slate-600">
              {service.description?.length > 160 ? `${service.description.slice(0, 160)}…` : service.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to={`/services/${service.id}`} className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-dark">
                View details
              </Link>
              <Link to={`/bookings/new?serviceId=${encodeURIComponent(service.id)}`} className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-brand hover:text-brand">
                Quick book
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
};

export default ServiceSearchPage;
