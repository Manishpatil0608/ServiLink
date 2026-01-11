import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import PageHeader from '../components/PageHeader.jsx';
import { fetchServiceDetail, fetchServices } from '../services/catalogService.js';
import { createBookingRequest } from '../services/bookingService.js';
import getErrorMessage from '../utils/getErrorMessage.js';

const steps = [
  {
    title: 'Choose schedule',
    description: 'Select a date, start time, and estimated duration for the visit.'
  },
  {
    title: 'Add service address',
    description: 'Share the onsite address and contact details so the provider can reach you.'
  },
  {
    title: 'Review & confirm',
    description: 'Double-check the schedule, pricing, and address before reserving your slot.'
  }
];

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

const combineDateAndTime = (dateValue, timeValue) => {
  if (!dateValue || !timeValue) {
    return null;
  }
  const result = new Date(`${dateValue}T${timeValue}`);
  return Number.isNaN(result.getTime()) ? null : result;
};

const formatDateTime = (value) => {
  if (!value) {
    return null;
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
};

const getDefaultDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

const BookingFlowPage = () => {
  const [searchParams] = useSearchParams();
  const serviceParam = searchParams.get('serviceId');

  const [activeStep, setActiveStep] = useState(0);
  const [didOverrideDuration, setDidOverrideDuration] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [createdBooking, setCreatedBooking] = useState(null);
  const [formState, setFormState] = useState({
    serviceId: serviceParam ? Number(serviceParam) : null,
    date: getDefaultDate(),
    startTime: '',
    durationMinutes: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: 'India',
    postalCode: '',
    latitude: '',
    longitude: ''
  });

  const serviceQuery = useQuery({
    queryKey: ['service', serviceParam],
    queryFn: () => fetchServiceDetail(serviceParam),
    enabled: Boolean(serviceParam)
  });

  const fallbackServiceQuery = useQuery({
    queryKey: ['services', 'booking-fallback'],
    queryFn: () => fetchServices({ page: 1, pageSize: 1 }),
    enabled: !serviceParam
  });

  const service = useMemo(() => {
    if (serviceQuery.data) {
      return serviceQuery.data;
    }
    return fallbackServiceQuery.data?.data?.[0] ?? null;
  }, [serviceQuery.data, fallbackServiceQuery.data]);

  useEffect(() => {
    if (service?.id) {
      setFormState((prev) => (prev.serviceId === service.id ? prev : { ...prev, serviceId: service.id }));
    }
  }, [service?.id]);

  useEffect(() => {
    if (!service?.avgDurationMinutes || didOverrideDuration) {
      return;
    }
    setFormState((prev) => {
      if (prev.durationMinutes) {
        return prev;
      }
      return { ...prev, durationMinutes: String(service.avgDurationMinutes) };
    });
  }, [service?.avgDurationMinutes, didOverrideDuration]);

  const bookingMutation = useMutation({
    mutationFn: createBookingRequest,
    onSuccess: (data) => {
      setCreatedBooking(data);
    }
  });

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleDurationChange = (event) => {
    setDidOverrideDuration(true);
    handleFieldChange(event);
  };

  const scheduleDate = useMemo(() => combineDateAndTime(formState.date, formState.startTime), [formState.date, formState.startTime]);

  const durationMinutesNumber = useMemo(() => {
    const parsed = Number(formState.durationMinutes || 0);
    return Number.isNaN(parsed) ? 0 : parsed;
  }, [formState.durationMinutes]);

  const estimatedEndDate = useMemo(() => {
    if (!scheduleDate || !durationMinutesNumber) {
      return null;
    }
    return new Date(scheduleDate.getTime() + durationMinutesNumber * 60000);
  }, [scheduleDate, durationMinutesNumber]);

  const bookingSummary = useMemo(() => {
    if (!service) {
      return [];
    }
    const summary = [
      { label: 'Service', value: service.title },
      { label: 'Provider', value: service.provider?.name ?? 'Assigned after confirmation' }
    ];
    summary.push({ label: 'Scheduled for', value: scheduleDate ? formatDateTime(scheduleDate) : 'Select schedule' });
    summary.push({ label: 'Estimated duration', value: durationMinutesNumber ? `${durationMinutesNumber} mins` : service.avgDurationMinutes ? `${service.avgDurationMinutes} mins` : 'Add duration' });
    summary.push({ label: 'Estimated total', value: formatPrice(service.basePrice, service.priceUnit) });
    if (formState.addressLine1 || formState.city) {
      const addressPreview = [formState.addressLine1, formState.city, formState.state].filter(Boolean).join(', ');
      summary.push({ label: 'Service address', value: addressPreview || 'Add address' });
    }
    return summary;
  }, [service, scheduleDate, durationMinutesNumber, formState.addressLine1, formState.city, formState.state]);

  const canProceedSchedule = Boolean(scheduleDate && durationMinutesNumber > 0);
  const canProceedAddress = Boolean(
    formState.addressLine1 &&
    formState.city &&
    formState.state &&
    formState.country &&
    formState.postalCode
  );

  const goToNextStep = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const goToPreviousStep = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const handleConfirmBooking = async (event) => {
    event.preventDefault();
    if (bookingMutation.isPending) {
      return;
    }
    setErrorMessage('');

    if (!service || !formState.serviceId) {
      setErrorMessage('Select a service before confirming the booking.');
      return;
    }

    const startDateTime = combineDateAndTime(formState.date, formState.startTime);
    if (!startDateTime) {
      setErrorMessage('Choose a valid start date and time.');
      return;
    }

    const durationValue = durationMinutesNumber || service.avgDurationMinutes || 60;
    if (!durationValue || durationValue <= 0) {
      setErrorMessage('Duration must be greater than 0 minutes.');
      return;
    }

    const endDateTime = new Date(startDateTime.getTime() + durationValue * 60000);

    const latitude = formState.latitude ? Number(formState.latitude) : null;
    const longitude = formState.longitude ? Number(formState.longitude) : null;
    if (latitude !== null && Number.isNaN(latitude)) {
      setErrorMessage('Latitude must be a valid number.');
      return;
    }
    if (longitude !== null && Number.isNaN(longitude)) {
      setErrorMessage('Longitude must be a valid number.');
      return;
    }

    const payload = {
      serviceId: Number(formState.serviceId),
      scheduledStart: startDateTime.toISOString(),
      scheduledEnd: endDateTime.toISOString(),
      addressLine1: formState.addressLine1,
      addressLine2: formState.addressLine2 || null,
      city: formState.city,
      state: formState.state,
      country: formState.country,
      postalCode: formState.postalCode,
      latitude,
      longitude
    };

    try {
      await bookingMutation.mutateAsync(payload);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Unable to confirm booking. Please try again.'));
    }
  };

  const isLoading = serviceQuery.isLoading || fallbackServiceQuery.isLoading;
  const isError = serviceQuery.isError || fallbackServiceQuery.isError;

  if (createdBooking) {
    const schedule = formatDateTime(createdBooking.scheduledStart);
    return (
      <main className="mx-auto max-w-4xl px-6 py-10">
        <PageHeader
          title="Booking confirmed"
          description="Your slot is reserved. We will send reminders as the service date approaches."
          actions={(
            <Link to="/dashboard" className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-dark">
              Go to dashboard
            </Link>
          )}
        />

        <section className="mt-10 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-800">
          <p className="text-xs uppercase tracking-wide">Booking code</p>
          <p className="mt-1 text-xl font-semibold">{createdBooking.bookingCode}</p>
          <dl className="mt-6 space-y-3 text-slate-700">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <dt className="text-xs uppercase tracking-wide text-slate-500">Service</dt>
              <dd className="font-semibold text-slate-900">{createdBooking.service?.title ?? 'Selected service'}</dd>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <dt className="text-xs uppercase tracking-wide text-slate-500">Provider</dt>
              <dd className="font-semibold text-slate-900">{createdBooking.provider?.businessName ?? 'Assigned shortly'}</dd>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <dt className="text-xs uppercase tracking-wide text-slate-500">Scheduled for</dt>
              <dd className="font-semibold text-slate-900">{schedule ?? 'To be scheduled'}</dd>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <dt className="text-xs uppercase tracking-wide text-slate-500">Total amount</dt>
              <dd className="font-semibold text-slate-900">{formatPrice(createdBooking.totalAmount, createdBooking.service?.priceUnit)}</dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to={`/bookings/${encodeURIComponent(createdBooking.id)}`} className="rounded-full border border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-700 transition hover:border-emerald-400">
              View booking details
            </Link>
            <Link to={`/services/${encodeURIComponent(createdBooking.serviceId)}`} className="rounded-full border border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-700 transition hover:border-emerald-400">
              View service details
            </Link>
            <Link to="/bookings/new" className="rounded-full border border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-700 transition hover:border-emerald-400">
              Make another booking
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <PageHeader
        title="Complete your booking"
        description="Finalize schedule, address, and confirmation. Your tentative slot will be held for the next 10 minutes."
        actions={(
          <Link to="/services" className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-brand hover:text-brand">
            Save & exit
          </Link>
        )}
      />

      <section className="mt-10 grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-6">
          <ol className="space-y-4">
            {steps.map((step, index) => {
              const isActive = index === activeStep;
              const isCompleted = index < activeStep;
              return (
                <li
                  key={step.title}
                  className={`flex gap-4 rounded-3xl border bg-white p-6 shadow-sm transition ${isActive ? 'border-brand' : 'border-slate-200'}`}
                >
                  <span className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${isActive ? 'bg-brand text-white' : 'bg-brand/10 text-brand'}`}>
                    {index + 1}
                  </span>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-semibold text-slate-900">{step.title}</h2>
                      {isCompleted ? <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600">Done</span> : null}
                    </div>
                    <p className="text-xs text-slate-500">{step.description}</p>
                    {isCompleted ? (
                      <button
                        type="button"
                        onClick={() => setActiveStep(index)}
                        className="text-xs font-semibold text-brand"
                      >
                        Edit step →
                      </button>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>

          <form className="space-y-6" onSubmit={handleConfirmBooking} noValidate>
            {activeStep === 0 ? (
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <header className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Schedule details</h3>
                    <p className="text-xs text-slate-500">Pick a date and preferred time slot. You can adjust duration if needed.</p>
                  </div>
                  {service?.availability?.length ? (
                    <span className="text-[11px] font-semibold text-brand">{service.availability.length} available slots</span>
                  ) : null}
                </header>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 text-xs text-slate-500">
                    Service date
                    <input
                      type="date"
                      name="date"
                      min={getDefaultDate()}
                      value={formState.date}
                      onChange={handleFieldChange}
                      className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                      required
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-xs text-slate-500">
                    Start time
                    <input
                      type="time"
                      name="startTime"
                      value={formState.startTime}
                      onChange={handleFieldChange}
                      className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                      required
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-xs text-slate-500">
                    Estimated duration (minutes)
                    <input
                      type="number"
                      name="durationMinutes"
                      min="15"
                      step="15"
                      value={formState.durationMinutes}
                      onChange={handleDurationChange}
                      className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                      placeholder={service?.avgDurationMinutes ? String(service.avgDurationMinutes) : '60'}
                      required
                    />
                  </label>
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
                    {scheduleDate ? (
                      <p>
                        Scheduled for <span className="font-semibold text-slate-800">{formatDateTime(scheduleDate)}</span>
                        {estimatedEndDate ? ` · Ends ~${formatDateTime(estimatedEndDate)}` : ''}
                      </p>
                    ) : (
                      <p>Select a date and time to preview availability.</p>
                    )}
                  </div>
                </div>

                {service?.availability?.length ? (
                  <div className="mt-6">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Typical weekly slots</p>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      {service.availability.slice(0, 4).map((slot) => (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setFormState((prev) => ({
                            ...prev,
                            startTime: slot.startTime ?? prev.startTime
                          }))}
                          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs text-slate-600 transition hover:border-brand hover:text-brand"
                        >
                          <span className="block font-semibold text-slate-800">Weekday {slot.weekday + 1}</span>
                          <span>{slot.startTime} - {slot.endTime}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={goToNextStep}
                    disabled={!canProceedSchedule}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${canProceedSchedule ? 'bg-brand text-white hover:bg-brand-dark' : 'bg-slate-200 text-slate-500'}`}
                  >
                    Continue to address
                  </button>
                </div>
              </section>
            ) : null}

            {activeStep === 1 ? (
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900">Service address</h3>
                <p className="mt-1 text-xs text-slate-500">We will share these details only with the assigned professional.</p>

                <div className="mt-5 grid gap-4">
                  <label className="flex flex-col gap-2 text-xs text-slate-500">
                    Address line 1
                    <input
                      type="text"
                      name="addressLine1"
                      value={formState.addressLine1}
                      onChange={handleFieldChange}
                      className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                      required
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-xs text-slate-500">
                    Address line 2 (optional)
                    <input
                      type="text"
                      name="addressLine2"
                      value={formState.addressLine2}
                      onChange={handleFieldChange}
                      className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                    />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-2 text-xs text-slate-500">
                      City
                      <input
                        type="text"
                        name="city"
                        value={formState.city}
                        onChange={handleFieldChange}
                        className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                        required
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-xs text-slate-500">
                      State
                      <input
                        type="text"
                        name="state"
                        value={formState.state}
                        onChange={handleFieldChange}
                        className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                        required
                      />
                    </label>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <label className="flex flex-col gap-2 text-xs text-slate-500 sm:col-span-2">
                      Country
                      <input
                        type="text"
                        name="country"
                        value={formState.country}
                        onChange={handleFieldChange}
                        className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                        required
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-xs text-slate-500">
                      PIN code
                      <input
                        type="text"
                        name="postalCode"
                        value={formState.postalCode}
                        onChange={handleFieldChange}
                        className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                        required
                      />
                    </label>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-2 text-xs text-slate-500">
                      Latitude (optional)
                      <input
                        type="text"
                        name="latitude"
                        value={formState.latitude}
                        onChange={handleFieldChange}
                        className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                        placeholder="e.g. 12.9716"
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-xs text-slate-500">
                      Longitude (optional)
                      <input
                        type="text"
                        name="longitude"
                        value={formState.longitude}
                        onChange={handleFieldChange}
                        className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                        placeholder="e.g. 77.5946"
                      />
                    </label>
                  </div>
                </div>

                <div className="mt-6 flex justify-between gap-3">
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-brand hover:text-brand"
                  >
                    Back to schedule
                  </button>
                  <button
                    type="button"
                    onClick={goToNextStep}
                    disabled={!canProceedAddress}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${canProceedAddress ? 'bg-brand text-white hover:bg-brand-dark' : 'bg-slate-200 text-slate-500'}`}
                  >
                    Continue to review
                  </button>
                </div>
              </section>
            ) : null}

            {activeStep === 2 ? (
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900">Review & confirm</h3>
                <p className="mt-1 text-xs text-slate-500">Confirm the details below before placing your booking request.</p>

                <div className="mt-5 space-y-4 text-xs text-slate-600">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">Schedule</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{scheduleDate ? formatDateTime(scheduleDate) : 'Not selected'}</p>
                    {estimatedEndDate ? (
                      <p className="mt-1 text-xs text-slate-500">Estimated completion around {formatDateTime(estimatedEndDate)}</p>
                    ) : null}
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">Service address</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {[formState.addressLine1, formState.addressLine2, formState.city, formState.state, formState.postalCode]
                        .filter(Boolean)
                        .join(', ') || 'Add your address'}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">Estimated total</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{service ? formatPrice(service.basePrice, service.priceUnit) : '—'}</p>
                    <p className="mt-1 text-xs text-slate-500">You will pay only after the service is completed.</p>
                  </div>
                </div>

                {errorMessage ? (
                  <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">{errorMessage}</p>
                ) : null}

                <div className="mt-6 flex justify-between gap-3">
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-brand hover:text-brand"
                  >
                    Back to address
                  </button>
                  <button
                    type="submit"
                    disabled={bookingMutation.isPending || !service || !canProceedSchedule || !canProceedAddress}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${bookingMutation.isPending || !service || !canProceedSchedule || !canProceedAddress ? 'bg-slate-200 text-slate-500' : 'bg-brand text-white hover:bg-brand-dark'}`}
                  >
                    {bookingMutation.isPending ? 'Confirming…' : 'Confirm booking'}
                  </button>
                </div>
              </section>
            ) : null}
          </form>
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Booking summary</h2>
          {isLoading ? (
            <p className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">Loading service information…</p>
          ) : null}

          {isError ? (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">Unable to load booking summary. Please refresh and try again.</p>
          ) : null}

          {!isLoading && !isError && service ? (
            <dl className="mt-4 space-y-3 text-xs text-slate-600">
              {bookingSummary.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <dt>{item.label}</dt>
                  <dd className="font-semibold text-slate-900 text-right">{item.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          <p className="mt-6 text-[11px] text-slate-500">Secure escrow keeps your payment safe until you mark the service as complete.</p>
          <p className="mt-2 text-[11px] text-slate-500">Need help? Contact support anytime from your dashboard.</p>
        </aside>
      </section>
    </main>
  );
};

export default BookingFlowPage;
