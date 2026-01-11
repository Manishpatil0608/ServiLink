import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import getErrorMessage from '../utils/getErrorMessage.js';
import { fetchProviderCategories, createProviderService } from '../services/providerService.js';

const ProviderAddServicePage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm({
    defaultValues: {
      title: '',
      categoryId: '',
      description: '',
      basePrice: '',
      priceUnit: 'per_job',
      serviceRadiusKm: '',
      avgDurationMinutes: ''
    }
  });

  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        const data = await fetchProviderCategories();
        if (isMounted) {
          setCategories(data || []);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(getErrorMessage(error, 'Unable to load categories.'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const onSubmit = async (values) => {
    setErrorMessage('');
    try {
      const payload = {
        ...values,
        categoryId: Number(values.categoryId),
        basePrice: Number(values.basePrice),
        serviceRadiusKm: values.serviceRadiusKm ? Number(values.serviceRadiusKm) : undefined,
        avgDurationMinutes: values.avgDurationMinutes ? Number(values.avgDurationMinutes) : undefined,
        isActive: true
      };
      await createProviderService(payload);
      navigate('/provider', { replace: true });
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Unable to create service. Please try again.'));
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <PageHeader
        title="Add new service"
        description="Describe the offering customers can book. These details power storefront listings and pricing."
        actions={(<Link to="/provider" className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600">Back to console</Link>)}
      />

      {errorMessage ? (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{errorMessage}</p>
      ) : null}

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {isLoading ? (
          <p className="text-sm text-slate-500">Loading categories…</p>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="text-sm font-medium text-slate-700">Service name</label>
              <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Eg. Deep home cleaning" {...register('title', { required: true })} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Category</label>
              <select className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...register('categoryId', { required: true })}>
                <option value="" disabled>Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Description</label>
              <textarea className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" rows={5} placeholder="Explain the scope, inclusions, and any special notes." {...register('description', { required: true })} />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium text-slate-700">Base price (₹)</label>
                <input type="number" step="0.01" min="0" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...register('basePrice', { required: true })} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Price unit</label>
                <select className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...register('priceUnit', { required: true })}>
                  <option value="per_job">Per job</option>
                  <option value="per_hour">Per hour</option>
                  <option value="per_day">Per day</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Service radius (km)</label>
                <input type="number" min="1" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Optional" {...register('serviceRadiusKm')} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Average duration (minutes)</label>
              <input type="number" min="15" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Optional" {...register('avgDurationMinutes')} />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600" onClick={() => navigate('/provider')}>Cancel</button>
              <button type="submit" className="rounded-full bg-brand px-5 py-2 text-xs font-semibold text-white hover:bg-brand-light disabled:opacity-60" disabled={isSubmitting}>
                {isSubmitting ? 'Saving…' : 'Publish service'}
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
};

export default ProviderAddServicePage;
