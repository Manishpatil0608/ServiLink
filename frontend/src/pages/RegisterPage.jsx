import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { registerRequest } from '../services/authService.js';
import getErrorMessage from '../utils/getErrorMessage.js';

const RegisterPage = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState,
    watch
  } = useForm({ defaultValues: { role: 'customer', businessName: '', department: '', adminNotes: '' } });
  const navigate = useNavigate();
  const selectedRole = watch('role');

  const onSubmit = async (values) => {
    setErrorMessage('');
    try {
      await registerRequest(values);
      navigate('/login', { replace: true });
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Unable to create your account right now.'));
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form className="w-full max-w-xl space-y-6 rounded-2xl bg-white p-8 shadow" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Create your account</h1>
          <p className="mt-1 text-sm text-slate-500">Join the Local Services platform as a customer, provider, service admin, or super admin.</p>
        </div>
        {errorMessage ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{errorMessage}</p>
        ) : null}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700">First name</label>
            <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...register('firstName', { required: true })} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Last name</label>
            <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...register('lastName', { required: true })} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input type="email" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...register('email', { required: true })} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Phone</label>
            <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...register('phone', { required: true })} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input type="password" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...register('password', { required: true })} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Role</label>
            <select className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...register('role', { required: true })}>
              <option value="customer">Customer</option>
              <option value="provider">Service Provider</option>
              <option value="service_admin">Service Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
          {selectedRole === 'provider' ? (
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Business / brand name</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                placeholder="Eg. FreshNest Cleaning Crew"
                {...register('businessName', { required: true })}
              />
              <p className="mt-1 text-xs text-slate-500">Shown to customers and used in provider approvals.</p>
            </div>
          ) : null}
          {selectedRole === 'service_admin' ? (
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Service category / department</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                placeholder="Eg. Home Maintenance Division"
                {...register('department', { required: true })}
              />
              <p className="mt-1 text-xs text-slate-500">Helps route escalations and workloads to your ownership area.</p>
            </div>
          ) : null}
          {selectedRole === 'super_admin' ? (
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Administrative notes</label>
              <textarea
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                rows={3}
                placeholder="Eg. Oversee all marketplace operations"
                {...register('adminNotes', { required: true })}
              />
              <p className="mt-1 text-xs text-slate-500">Stored internally to track executive context for this account.</p>
            </div>
          ) : null}
        </div>
        <button type="submit" className="w-full rounded-lg bg-brand px-4 py-2 font-medium text-white hover:bg-brand-light disabled:opacity-60" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
        <p className="text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="font-medium text-brand">Sign in</Link>
        </p>
      </form>
    </main>
  );
};

export default RegisterPage;
