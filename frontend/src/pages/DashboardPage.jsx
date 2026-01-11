import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import { useAuth } from '../hooks/useAuth.js';
import getDisplayName from '../utils/getDisplayName.js';
import { fetchCustomerBookings } from '../services/bookingService.js';
import {
  formatBookingSchedule,
  getBookingStatusLabel,
  getBookingStatusClassName
} from '../utils/bookingDisplay.js';

const recommendations = [
  {
    title: 'Spring deep clean',
    description: 'Earn 10% cashback when you schedule before 15 Jan.',
    cta: 'Book now',
    serviceId: 'SRV-101'
  },
  {
    title: 'Water purifier care',
    description: 'Certified technicians with 4.9 rating. Slots filling fast.',
    cta: 'View plans',
    serviceId: 'SRV-233'
  }
];

const DashboardPage = () => {
  const { user } = useAuth();
  const displayName = getDisplayName(user);
  const {
    data: bookingsData,
    isLoading: isBookingsLoading,
    isError: isBookingsError
  } = useQuery({
    queryKey: ['customer-bookings', { page: 1, pageSize: 5 }],
    queryFn: () => fetchCustomerBookings({ page: 1, pageSize: 5 })
  });

  const bookings = bookingsData?.bookings ?? [];
  const totalBookings = bookingsData?.meta?.total ?? bookings.length;
  const nextBooking = bookings[0] ?? null;
  const upcomingStatValue = String(totalBookings).padStart(2, '0');
  const upcomingSubtext = nextBooking ? `Next on ${formatBookingSchedule(nextBooking.scheduledStart)}` : 'Schedule your first service';

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <PageHeader
        title={displayName ? `Welcome back, ${displayName}` : 'Welcome back'}
        description="Track bookings, wallet balance, and get curated recommendations based on recent activity."
        actions={(
          <Link to="/bookings/new" className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark">
            New booking
          </Link>
        )}
      />

      <section className="mt-10 grid gap-6 lg:grid-cols-4">
        <StatCard label="Wallet balance" value="₹2,450" subtext="Cashback expiring in 4 days" trend="+12%" />
        <StatCard label="Upcoming bookings" value={upcomingStatValue} subtext={upcomingSubtext} />
        <StatCard label="Open support tickets" value="0" subtext="All issues resolved" trend="-100%" />
        <StatCard label="Reward tier" value="Gold" subtext="2 more bookings to unlock Platinum" />
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Upcoming services</h2>
            <Link to="/bookings" className="text-sm font-medium text-brand">
              View all
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {isBookingsLoading ? (
              <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">Loading upcoming bookings…</p>
            ) : null}

            {isBookingsError ? (
              <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-600">Unable to load bookings right now. Please try again shortly.</p>
            ) : null}

            {!isBookingsLoading && !isBookingsError && bookings.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
                No upcoming bookings yet. Start by reserving a service to see it appear here.
              </p>
            ) : null}

            {!isBookingsLoading && !isBookingsError && bookings.length > 0 ? (
              <ul className="space-y-4">
                {bookings.map((booking) => (
                  <li key={booking.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <Link to={`/services/${encodeURIComponent(booking.serviceId)}`} className="text-sm font-semibold text-brand">
                          {booking.service?.title ?? 'Service details'}
                        </Link>
                        <p className="text-xs text-slate-500">{booking.provider?.businessName ?? 'Provider assigned soon'}</p>
                      </div>
                      <span className={`text-xs font-medium ${getBookingStatusClassName(booking.status)}`}>
                        {getBookingStatusLabel(booking.status)}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">{formatBookingSchedule(booking.scheduledStart)}</p>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Wallet summary</h2>
            <dl className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <dt>Pending payouts</dt>
                <dd className="font-semibold text-slate-900">₹540</dd>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <dt>Reward credits</dt>
                <dd className="font-semibold text-slate-900">₹320</dd>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <dt>Last payment method</dt>
                <dd className="font-semibold text-slate-900">UPI • Axis Bank</dd>
              </div>
            </dl>
            <Link to="/wallet" className="mt-5 inline-flex items-center text-sm font-semibold text-brand">
              Manage wallet →
            </Link>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Suggested for you</h2>
            <ul className="mt-4 space-y-4">
              {recommendations.map((item) => (
                <li key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-2 text-xs text-slate-500">{item.description}</p>
                  <Link to={`/services/${encodeURIComponent(item.serviceId)}`} className="mt-3 inline-flex items-center text-sm font-semibold text-brand">
                    {item.cta} →
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
};

export default DashboardPage;
