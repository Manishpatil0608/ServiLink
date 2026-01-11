import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import getErrorMessage from '../utils/getErrorMessage.js';
import {
  fetchProviderServices,
  fetchServiceAvailability,
  updateServiceAvailability
} from '../services/providerService.js';

const weekdayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const emptySlot = {
  weekday: 0,
  startTime: '09:00',
  endTime: '17:00',
  isRecurring: true,
  customDate: null
};

const ProviderAvailabilityPage = () => {
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [slots, setSlots] = useState([]);
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadServices = async () => {
      try {
        const data = await fetchProviderServices();
        if (!isMounted) {
          return;
        }
        setServices(data || []);
        if (data?.length) {
          setSelectedServiceId(String(data[0].id));
        }
      } catch (error) {
        if (isMounted) {
          setStatus({ type: 'error', message: getErrorMessage(error, 'Unable to load services.') });
        }
      }
    };
    loadServices();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedServiceId) {
      setSlots([]);
      return;
    }
    let isMounted = true;
    const loadAvailability = async () => {
      setStatus({ type: 'loading', message: 'Loading availability…' });
      try {
        const data = await fetchServiceAvailability(selectedServiceId);
        if (isMounted) {
          setSlots(data?.length ? data : []);
          setStatus({ type: 'idle', message: '' });
        }
      } catch (error) {
        if (isMounted) {
          setStatus({ type: 'error', message: getErrorMessage(error, 'Unable to load availability.') });
        }
      }
    };
    loadAvailability();
    return () => {
      isMounted = false;
    };
  }, [selectedServiceId]);

  const updateSlot = (index, field, value) => {
    setSlots((prev) => prev.map((slot, idx) => (idx === index ? { ...slot, [field]: value } : slot)));
  };

  const removeSlot = (index) => {
    setSlots((prev) => prev.filter((_, idx) => idx !== index));
  };

  const addSlot = () => {
    setSlots((prev) => [...prev, { ...emptySlot }]);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!selectedServiceId) {
      return;
    }
    setIsSaving(true);
    setStatus({ type: 'idle', message: '' });
    try {
      const payload = slots.map((slot) => ({
        weekday: Number(slot.weekday),
        startTime: slot.startTime,
        endTime: slot.endTime,
        isRecurring: slot.isRecurring,
        customDate: slot.customDate || null
      }));
      await updateServiceAvailability(selectedServiceId, payload);
      setStatus({ type: 'success', message: 'Availability updated.' });
    } catch (error) {
      setStatus({ type: 'error', message: getErrorMessage(error, 'Unable to update availability.') });
    } finally {
      setIsSaving(false);
    }
  };

  const serviceOptions = useMemo(() => services.map((service) => ({
    id: String(service.id),
    label: service.title
  })), [services]);

  const noServices = !services.length;

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <PageHeader
        title="Update availability"
        description="Define when customers can book this service. Choose recurring slots or set one-off windows."
        actions={(<Link to="/provider" className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600">Back to console</Link>)}
      />

      {status.type === 'error' ? (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{status.message}</p>
      ) : null}
      {status.type === 'success' ? (
        <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{status.message}</p>
      ) : null}

      {noServices ? (
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          <p>You have not published any services yet. Create your first offering to set availability.</p>
          <Link to="/provider/services/new" className="mt-4 inline-flex rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand-light">Add new service</Link>
        </section>
      ) : (
        <form className="mt-6 space-y-6" onSubmit={handleSave}>
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <label className="text-sm font-medium text-slate-700">Select service</label>
              <select
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                value={selectedServiceId}
                onChange={(event) => setSelectedServiceId(event.target.value)}
              >
                {serviceOptions.map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </div>

            {status.type === 'loading' ? (
              <p className="mt-6 text-sm text-slate-500">{status.message}</p>
            ) : (
              <div className="mt-6 space-y-4">
                {slots.length ? slots.map((slot, index) => (
                  <div key={`${slot.weekday}-${index}`} className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr,1fr,1fr,auto]">
                    <div>
                      <label className="text-xs font-semibold text-slate-600">Weekday</label>
                      <select
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                        value={slot.weekday}
                        onChange={(event) => updateSlot(index, 'weekday', Number(event.target.value))}
                      >
                        {weekdayLabels.map((label, value) => (
                          <option key={label} value={value}>{label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600">Start time</label>
                      <input
                        type="time"
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                        value={slot.startTime}
                        onChange={(event) => updateSlot(index, 'startTime', event.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600">End time</label>
                      <input
                        type="time"
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                        value={slot.endTime}
                        onChange={(event) => updateSlot(index, 'endTime', event.target.value)}
                        required
                      />
                    </div>
                    <div className="flex items-end justify-end">
                      <button type="button" className="rounded-full border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600" onClick={() => removeSlot(index)}>Remove</button>
                    </div>
                  </div>
                )) : (
                  <p className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-500">No slots yet. Add your first availability window.</p>
                )}

                <button type="button" className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600" onClick={addSlot}>Add slot</button>
              </div>
            )}
          </section>

          <div className="flex justify-end gap-2">
            <Link to="/provider" className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600">Cancel</Link>
            <button type="submit" className="rounded-full bg-brand px-5 py-2 text-xs font-semibold text-white hover:bg-brand-light disabled:opacity-60" disabled={isSaving || status.type === 'loading'}>
              {isSaving ? 'Saving…' : 'Save availability'}
            </button>
          </div>
        </form>
      )}
    </main>
  );
};

export default ProviderAvailabilityPage;
