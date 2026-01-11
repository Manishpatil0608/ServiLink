import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { submitPasswordReset } from '../services/authService.js';
import getErrorMessage from '../utils/getErrorMessage.js';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { register, handleSubmit, formState, setValue } = useForm({
    defaultValues: {
      token: '',
      password: '',
      confirmPassword: ''
    }
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const tokenFromQuery = searchParams.get('token');
    if (tokenFromQuery) {
      setValue('token', tokenFromQuery);
    }
  }, [searchParams, setValue]);

  const onSubmit = async (values) => {
    setErrorMessage('');
    setSuccessMessage('');

    if (values.password !== values.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      const data = await submitPasswordReset({ token: values.token.trim(), password: values.password });
      setSuccessMessage(data?.message || 'Your password has been updated. You can now sign in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Unable to reset password with the provided token.'));
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Reset password</h1>
          <p className="mt-1 text-sm text-slate-500">Paste the token you received and choose a new password to regain access.</p>
        </div>
        {errorMessage ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{errorMessage}</p>
        ) : null}
        {successMessage ? (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{successMessage}</p>
        ) : null}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Reset token</label>
            <input className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-brand focus:outline-none" {...register('token', { required: true, minLength: 64, maxLength: 64 })} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">New password</label>
            <input type="password" className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-brand focus:outline-none" {...register('password', { required: true, minLength: 8 })} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Confirm password</label>
            <input type="password" className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-brand focus:outline-none" {...register('confirmPassword', { required: true, minLength: 8 })} />
          </div>
        </div>
        <button type="submit" className="w-full rounded-lg bg-brand px-4 py-2 font-medium text-white hover:bg-brand-light disabled:opacity-60" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? 'Updating password…' : 'Update password'}
        </button>
        <p className="text-center text-sm text-slate-500">
          <Link to="/login" className="font-medium text-brand">Back to sign in</Link>
        </p>
      </form>
    </main>
  );
};

export default ResetPasswordPage;
