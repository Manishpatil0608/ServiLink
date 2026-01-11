import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import getDisplayName from '../utils/getDisplayName.js';

const TopNav = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const links = [
    { label: 'Services', href: '/services' },
    { label: 'Providers', href: '/provider' },
    { label: 'Pricing', href: '/support' },
    { label: 'Contact', href: '/support' }
  ];

  const roleHome = {
    customer: '/dashboard',
    provider: '/provider',
    service_admin: '/admin/service',
    super_admin: '/admin/super',
    category_admin: '/admin/category',
    master_admin: '/admin/super'
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout', error);
    } finally {
      navigate('/', { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="text-xl font-semibold text-brand">
          ServiLink
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
          {links.map((link) => (
            <Link key={link.label} to={link.href} className="transition-colors hover:text-brand">
              {link.label}
            </Link>
          ))}
        </nav>
        {user ? (
          <div className="flex items-center gap-3">
            <Link to={roleHome[user.role] || '/dashboard'} className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-brand hover:text-brand sm:inline-flex">
              {getDisplayName(user) || 'Dashboard'}
            </Link>
            <button type="button" onClick={handleLogout} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700">
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="rounded-full border border-brand px-4 py-2 text-sm font-medium text-brand transition-colors hover:bg-brand hover:text-white">
              Sign in
            </Link>
            <Link to="/register" className="hidden rounded-full bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-dark sm:inline-flex">
              Join as customer
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopNav;
