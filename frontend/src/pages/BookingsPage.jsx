import { Link, useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../components/PageHeader.jsx';
import { fetchCustomerBookings } from '../services/bookingService.js';
import getErrorMessage from '../utils/getErrorMessage.js';
import {
  formatBookingSchedule,
  getBookingStatusClassName,
  getBookingStatusLabel,
  formatBookingAmount,
  buildBookingAddressPreview
} from '../utils/bookingDisplay.js';

const STATUS_FILTERS = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Pending confirmation' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' }
];

const PAGE_SIZE = 10;

const getValidStatus = (value) => {
  const match = STATUS_FILTERS.find((item) => item.value === value);
  return match ? match.value : 'all';
};

const parsePageNumber = (value) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric) || numeric < 1) {
    return 1;
  }
  return Math.floor(numeric);
};

const BookingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = getValidStatus(searchParams.get('status'));
  const currentPage = parsePageNumber(searchParams.get('page'));

  const {
    data,
    error,
    isLoading,
    isFetching
  } = useQuery({
    queryKey: ['customer-bookings', { page: currentPage, status: statusFilter }],
    queryFn: () => fetchCustomerBookings({
      page: currentPage,
      pageSize: PAGE_SIZE,
      status: statusFilter === 'all' ? undefined : statusFilter
    }),
    keepPreviousData: true
  });

  const bookings = data?.bookings ?? [];
  const meta = data?.meta ?? {};
  const totalPages = meta.totalPages ?? 1;
  const totalBookings = meta.total ?? bookings.length;

  const errorMessage = useMemo(() => (error ? getErrorMessage(error, 'Unable to load bookings.') : ''), [error]);

  const handleStatusChange = (nextValue) => {
    const params = new URLSearchParams(searchParams);
    if (nextValue === 'all') {
      params.delete('status');
    } else {
      params.set('status', nextValue);
    }
    params.delete('page');
    setSearchParams(params, { replace: true });
  };

  const handlePageChange = (nextPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(nextPage));
    setSearchParams(params, { replace: true });
  };

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <PageHeader
        title="Your bookings"
        description="Review upcoming and past services, track status updates, and access booking details."
        actions={(
          <Link to="/bookings/new" className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark">
            New booking
          </Link>
        )}
      />

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Filter by status</h2>
            <p className="text-xs text-slate-500">Showing {totalBookings} booking{totalBookings === 1 ? '' : 's'} across {totalPages} page{totalPages === 1 ? '' : 's'}.</p>
          </div>
          <nav className="flex flex-wrap gap-2 text-xs">
            {STATUS_FILTERS.map((filter) => {
              const isActive = filter.value === statusFilter;
              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => handleStatusChange(filter.value)}
                  className={`rounded-full border px-3 py-1 font-semibold transition ${isActive ? 'border-brand bg-brand/10 text-brand' : 'border-slate-200 bg-white text-slate-600 hover:border-brand hover:text-brand'}`}
                >
                  {filter.label}
                </button>
              );
            })}
          </nav>
        </header>

        <div className="mt-6 space-y-4">
          {isLoading ? (
            <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">Loading bookings…</p>
          ) : null}

          {errorMessage ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-600">{errorMessage}</p>
          ) : null}

          {!isLoading && !errorMessage && bookings.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
              No bookings found for this filter. Try selecting a different status or book a new service.
            </p>
          ) : null}

          {!isLoading && !errorMessage && bookings.length > 0 ? (
            <ul className="space-y-4">
              {bookings.map((booking) => (
                <li key={booking.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">Booking code</p>
                      <p className="text-sm font-semibold text-slate-900">{booking.bookingCode}</p>
                    </div>
                    <span className={`text-xs font-semibold ${getBookingStatusClassName(booking.status)}`}>
                      {getBookingStatusLabel(booking.status)}
                    </span>
                  </div>

                  <dl className="mt-4 grid gap-3 text-xs text-slate-500 sm:grid-cols-2">
                    <div>
                      <dt className="uppercase tracking-wide text-slate-400">Service</dt>
                      <dd className="mt-1 text-sm font-semibold text-slate-900">{booking.service?.title ?? 'Service details'}</dd>
                      <dd className="mt-1">{booking.provider?.businessName ?? 'Provider assignment pending'}</dd>
                    </div>
                    <div>
                      <dt className="uppercase tracking-wide text-slate-400">Scheduled for</dt>
                      <dd className="mt-1 text-sm font-semibold text-slate-900">{formatBookingSchedule(booking.scheduledStart)}</dd>
                      <dd className="mt-1">Ends at: {booking.scheduledEnd ? formatBookingSchedule(booking.scheduledEnd) : 'To be updated'}</dd>
                    </div>
                    <div>
                      <dt className="uppercase tracking-wide text-slate-400">Total amount</dt>
                      <dd className="mt-1 text-sm font-semibold text-slate-900">{formatBookingAmount(booking.totalAmount)}</dd>
                      <dd className="mt-1 capitalize">Payment: {booking.paymentStatus ?? 'pending'}</dd>
                    </div>
                    <div>
                      <dt className="uppercase tracking-wide text-slate-400">Service address</dt>
                      <dd className="mt-1 text-sm font-semibold text-slate-900">{buildBookingAddressPreview(booking.address)}</dd>
                    </div>
                  </dl>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link to={`/bookings/${encodeURIComponent(booking.id)}`} className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-brand hover:text-brand">
                      View details
                    </Link>
                    <Link to={`/services/${encodeURIComponent(booking.serviceId)}`} className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-brand hover:text-brand">
                      View service
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {totalPages > 1 ? (
          <footer className="mt-6 flex flex-col items-center gap-3 border-t border-slate-200 pt-4 text-xs text-slate-500 sm:flex-row sm:justify-between">
            <p>
              Page {currentPage} of {totalPages}
              {isFetching ? ' · Updating…' : ''}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!canGoPrevious}
                className={`rounded-full border px-3 py-1 font-semibold transition ${canGoPrevious ? 'border-slate-200 text-slate-700 hover:border-brand hover:text-brand' : 'cursor-not-allowed border-slate-100 text-slate-300'}`}
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!canGoNext}
                className={`rounded-full border px-3 py-1 font-semibold transition ${canGoNext ? 'border-slate-200 text-slate-700 hover:border-brand hover:text-brand' : 'cursor-not-allowed border-slate-100 text-slate-300'}`}
              >
                Next
              </button>
            </div>
          </footer>
        ) : null}
      </section>
    </main>
  );
};

export default BookingsPage;
