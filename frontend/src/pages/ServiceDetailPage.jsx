import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../components/PageHeader.jsx';
import { fetchServiceDetail } from '../services/catalogService.js';

const weekdayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ServiceDetailPage = () => {
  const { serviceId } = useParams();

  const serviceQuery = useQuery({
    queryKey: ['service', serviceId],
    queryFn: () => fetchServiceDetail(serviceId),
    enabled: Boolean(serviceId)
  });

  const service = serviceQuery.data;

  if (serviceQuery.isLoading) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <p className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">Loading service details…</p>
      </main>
    );
  }

  if (serviceQuery.isError || !service) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <p className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">We could not find that service. Browse <Link to="/services" className="font-semibold text-brand">other services</Link>.</p>
      </main>
    );
  }

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

  const infoHighlights = [
    service.avgDurationMinutes ? `Average duration ${service.avgDurationMinutes} mins` : null,
    service.serviceRadiusKm ? `Service radius up to ${service.serviceRadiusKm} km` : null,
    service.provider.ratingAverage ? `Rated ${service.provider.ratingAverage.toFixed(1)}★ (${service.provider.totalReviews} reviews)` : 'Be the first to review this service'
  ].filter(Boolean);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <PageHeader
        title={service.title}
        description={service.description}
        actions={(
          <Link to={`/bookings/new?serviceId=${encodeURIComponent(service.id)}`} className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-dark">
            Book this service
          </Link>
        )}
      />

      <section className="mt-10 grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Service overview</h2>
          <p className="mt-1 text-xs text-slate-500">Delivered by {service.provider.name}</p>
          <p className="mt-4 text-sm text-slate-600 whitespace-pre-line">{service.description}</p>
          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Highlights</h3>
            <ul className="mt-3 space-y-2 text-xs text-slate-500">
              {infoHighlights.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </article>

        <aside className="flex flex-col gap-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">Starting at</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{formatPrice(service.basePrice, service.priceUnit)}</p>
            <p className="mt-2 text-xs text-slate-500">Provider contact • {service.provider.email ?? 'Email on file'} • {service.provider.phone ?? 'Phone on file'}</p>
            <Link to={`/bookings/new?serviceId=${encodeURIComponent(service.id)}`} className="mt-4 block w-full rounded-full bg-brand px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-dark">
              Reserve slot
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">Upcoming availability</h2>
            {service.availability?.length ? (
              <ul className="mt-4 space-y-3">
                {service.availability.slice(0, 5).map((slot) => (
                  <li key={slot.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <span className="text-sm font-medium text-slate-700">{weekdayLabels[slot.weekday] ?? `Day ${slot.weekday + 1}`}</span>
                    <span className="text-xs font-semibold text-brand">{slot.startTime} - {slot.endTime}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-xs text-slate-500">Provider updates their availability on request. Continue to booking to share your preferred slot.</p>
            )}
          </div>
        </aside>
      </section>

      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Ratings & reviews</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-3">
          <div>
            <p className="text-4xl font-semibold text-slate-900">{service.provider.ratingAverage ? service.provider.ratingAverage.toFixed(1) : '—'}</p>
            <p className="text-xs text-slate-500">{service.provider.totalReviews ? `${service.provider.totalReviews} customer reviews` : 'Reviews coming soon'}</p>
          </div>
          <div className="sm:col-span-2 space-y-4 text-xs text-slate-600">
            <p>Customer stories and testimonials will appear here shortly. Share your experience after your booking to help others choose confidently.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ServiceDetailPage;
