import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import GoogleSignInButton from '../components/GoogleSignInButton.jsx';
import getErrorMessage from '../utils/getErrorMessage.js';

const LoginPage = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const roleHome = {
    customer: '/dashboard',
    provider: '/provider',
    service_admin: '/admin/service',
    super_admin: '/admin/super'
  };

  const resolveRedirect = (role) => {
    const defaultPath = roleHome[role] || '/dashboard';
    const requestedPath = location.state?.from?.pathname;
    if (requestedPath && requestedPath !== '/login') {
      return requestedPath;
    }
    return defaultPath;
  };

  const onSubmit = async (values) => {
    setErrorMessage('');
    try {
      const data = await login(values);
      navigate(resolveRedirect(data?.user?.role), { replace: true });
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Unable to sign in with the provided credentials.'));
    }
  };

  const handleGoogleError = (error) => {
    setErrorMessage(getErrorMessage(error, 'Unable to sign in with Google.'));
  };

  const handleGoogleSuccess = (data) => {
    navigate(resolveRedirect(data?.user?.role), { replace: true });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Sign in</h1>
          <p className="mt-1 text-sm text-slate-500">Welcome back! Enter your details to continue.</p>
        </div>
        {errorMessage ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{errorMessage}</p>
        ) : null}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Email or phone</label>
            <input className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand focus:outline-none" {...register('email', { required: true })} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 pr-16 text-slate-900 focus:border-brand focus:outline-none"
                {...register('password', { required: true })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 mr-2 mt-1 flex items-center rounded-md px-3 text-xs font-semibold text-slate-600 hover:text-brand"
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className="mt-1 text-right text-xs">
              <Link to="/forgot-password" className="font-medium text-brand">Forgot password?</Link>
            </div>
          </div>
        </div>
        <button type="submit" className="w-full rounded-lg bg-brand px-4 py-2 font-medium text-white hover:bg-brand-light disabled:opacity-60" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          <span>or</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>
        <GoogleSignInButton onError={handleGoogleError} onSuccess={handleGoogleSuccess} />
        <p className="text-center text-sm text-slate-500">
          New here? <Link to="/register" className="font-medium text-brand">Create an account</Link>
        </p>
      </form>
    </main>
  );
};

export default LoginPage;
