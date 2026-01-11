import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '../services/authService.js';
import getErrorMessage from '../utils/getErrorMessage.js';

const ForgotPasswordPage = () => {
  const { register, handleSubmit, formState } = useForm();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [devToken, setDevToken] = useState('');

  const onSubmit = async (values) => {
    setErrorMessage('');
    setSuccessMessage('');
    setDevToken('');
    try {
      const data = await requestPasswordReset(values.identifier.trim());
      setSuccessMessage(data?.message || 'If that account exists, a reset link has been sent.');
      if (data?.resetToken) {
        setDevToken(data.resetToken);
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Unable to initiate password reset at the moment.'));
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Forgot password</h1>
          <p className="mt-1 text-sm text-slate-500">Enter the email or phone number linked to your account and we&apos;ll send reset instructions.</p>
        </div>
        {errorMessage ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{errorMessage}</p>
        ) : null}
        {successMessage ? (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{successMessage}</p>
        ) : null}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Email or phone</label>
            <input className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-brand focus:outline-none" {...register('identifier', { required: true })} />
          </div>
        </div>
        <button type="submit" className="w-full rounded-lg bg-brand px-4 py-2 font-medium text-white hover:bg-brand-light disabled:opacity-60" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? 'Sending reset link…' : 'Send reset link'}
        </button>
        {devToken ? (
          <div className="rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600">
            <p className="font-semibold">Development token</p>
            <p className="break-all">{devToken}</p>
            <p className="mt-1">Use this token with the reset form while email delivery is not configured.</p>
          </div>
        ) : null}
        <p className="text-center text-sm text-slate-500">
          Remembered it? <Link to="/login" className="font-medium text-brand">Back to sign in</Link>
        </p>
      </form>
    </main>
  );
};

export default ForgotPasswordPage;
