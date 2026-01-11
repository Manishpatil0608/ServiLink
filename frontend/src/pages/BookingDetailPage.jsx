import { Link, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../components/PageHeader.jsx';
import { fetchCustomerBookingById } from '../services/bookingService.js';
import getErrorMessage from '../utils/getErrorMessage.js';
import {
  formatBookingSchedule,
  getBookingStatusClassName,
  getBookingStatusLabel,
  formatBookingAmount,
  buildBookingAddressPreview
} from '../utils/bookingDisplay.js';

const formatDateTime = (value) => {
  if (!value) {
    return '—';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
};

const calculateDuration = (start, end) => {
  if (!start || !end) {
    return null;
  }
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return null;
  }
  const diffMinutes = Math.round((endDate.getTime() - startDate.getTime()) / 60000);
  return diffMinutes > 0 ? diffMinutes : null;
};

const BookingDetailPage = () => {
  const { bookingId } = useParams();

  const {
    data: booking,
    error,
    isLoading,
    isFetching
  } = useQuery({
    queryKey: ['customer-booking', bookingId],
    queryFn: () => fetchCustomerBookingById(bookingId),
    enabled: Boolean(bookingId)
  });

  const errorMessage = useMemo(() => (error ? getErrorMessage(error, 'Unable to load booking details.') : ''), [error]);
  const durationMinutes = calculateDuration(booking?.scheduledStart, booking?.scheduledEnd);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <PageHeader
        title={booking?.bookingCode ? `Booking ${booking.bookingCode}` : 'Booking details'}
        description="All timelines, contact information, and payment summaries for this reservation."
        actions={(
          <div className="flex flex-wrap gap-3">
            <Link to="/bookings" className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-brand hover:text-brand">
              Back to bookings
            </Link>
            {booking?.serviceId ? (
              <Link to={`/services/${encodeURIComponent(booking.serviceId)}`} className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-brand hover:text-brand">
                View service
              </Link>
            ) : null}
          </div>
        )}
      />

      <section className="mt-8 space-y-6">
        {isLoading ? (
          <p className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-xs text-slate-500">Loading booking details…</p>
        ) : null}

        {errorMessage ? (
          <p className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-xs text-rose-600">{errorMessage}</p>
        ) : null}

        {!isLoading && !errorMessage && !booking ? (
          <p className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-xs text-slate-500">Booking not found or no longer accessible.</p>
        ) : null}

        {booking ? (
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Status</p>
                <p className={`text-lg font-semibold ${getBookingStatusClassName(booking.status)}`}>
                  {getBookingStatusLabel(booking.status)}
                </p>
              </div>
              <div className="text-xs text-slate-500">
                <p>Payment status: <span className="capitalize text-slate-700">{booking.paymentStatus ?? 'pending'}</span></p>
                <p>Last updated: {formatDateTime(booking.updatedAt)}</p>
                {isFetching ? <p className="text-amber-600">Refreshing…</p> : null}
              </div>
            </header>

            <dl className="mt-6 grid gap-6 text-xs text-slate-500 sm:grid-cols-2">
              <div>
                <dt className="uppercase tracking-wide text-slate-400">Service</dt>
                <dd className="mt-1 text-sm font-semibold text-slate-900">{booking.service?.title ?? 'Service details'}</dd>
                <dd className="mt-1">{booking.provider?.businessName ?? 'Provider assignment pending'}</dd>
              </div>
              <div>
                <dt className="uppercase tracking-wide text-slate-400">Schedule</dt>
                <dd className="mt-1 text-sm font-semibold text-slate-900">{formatBookingSchedule(booking.scheduledStart)}</dd>
                <dd className="mt-1">Ends at: {formatBookingSchedule(booking.scheduledEnd)}</dd>
                <dd className="mt-1">Duration: {durationMinutes ? `${durationMinutes} mins` : 'To be updated'}</dd>
              </div>
              <div>
                <dt className="uppercase tracking-wide text-slate-400">Service address</dt>
                <dd className="mt-1 text-sm font-semibold text-slate-900">{buildBookingAddressPreview(booking.address)}</dd>
                {booking.address?.latitude !== null && booking.address?.latitude !== undefined &&
                booking.address?.longitude !== null && booking.address?.longitude !== undefined ? (
                  <dd className="mt-1">Coordinates: {booking.address.latitude}, {booking.address.longitude}</dd>
                ) : null}
              </div>
              <div>
                <dt className="uppercase tracking-wide text-slate-400">Customer</dt>
                <dd className="mt-1 text-sm font-semibold text-slate-900">{booking.customer?.firstName ? `${booking.customer.firstName} ${booking.customer.lastName ?? ''}`.trim() : 'You'}</dd>
                {booking.customer?.email ? <dd className="mt-1">{booking.customer.email}</dd> : null}
                {booking.customer?.phone ? <dd className="mt-1">{booking.customer.phone}</dd> : null}
              </div>
              <div>
                <dt className="uppercase tracking-wide text-slate-400">Payment summary</dt>
                <dd className="mt-1 text-sm font-semibold text-slate-900">Total: {formatBookingAmount(booking.totalAmount)}</dd>
                <dd className="mt-1">Subtotal: {formatBookingAmount(booking.subtotal)}</dd>
                <dd className="mt-1">Tax: {formatBookingAmount(booking.tax)}</dd>
              </div>
              <div>
                <dt className="uppercase tracking-wide text-slate-400">Identifiers</dt>
                <dd className="mt-1">Booking ID: {booking.id}</dd>
                <dd className="mt-1">Provider ID: {booking.providerId ?? '—'}</dd>
                <dd className="mt-1">Service ID: {booking.serviceId}</dd>
                <dd className="mt-1">Created at: {formatDateTime(booking.createdAt)}</dd>
              </div>
            </dl>

            {booking.cancellationReason ? (
              <section className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-600">
                <p className="font-semibold">Cancellation reason</p>
                <p className="mt-1 text-slate-700">{booking.cancellationReason}</p>
              </section>
            ) : null}
          </article>
        ) : null}
      </section>
    </main>
  );
};

export default BookingDetailPage;
