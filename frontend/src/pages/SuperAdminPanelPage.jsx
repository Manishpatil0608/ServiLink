import PageHeader from '../components/PageHeader.jsx';
import { useAuth } from '../hooks/useAuth.js';
import getDisplayName from '../utils/getDisplayName.js';

const platformMetrics = [
  { label: 'Daily GMV', value: '₹12.4L', change: '+8.2%' },
  { label: 'Active providers', value: '18,420', change: '+3.1%' },
  { label: 'Platform NPS', value: '67', change: '+4 pts' }
];

const SuperAdminPanelPage = () => {
  const { user } = useAuth();
  const displayName = getDisplayName(user);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <PageHeader
        title="Super admin control tower"
        description={`Signed in as ${displayName || 'super admin'}. Oversee the entire marketplace with unified analytics, risk controls, and broadcast management.`}
        actions={(
          <div className="flex flex-wrap gap-2">
            <button type="button" className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-brand hover:text-brand">Manage roles</button>
            <button type="button" className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-dark">Download reports</button>
          </div>
        )}
      />

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        {platformMetrics.map((metric) => (
          <article key={metric.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">{metric.label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{metric.value}</p>
            <p className="mt-1 text-xs text-emerald-600">{metric.change}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Risk & compliance overview</h2>
          <ul className="mt-4 space-y-3 text-xs text-slate-600">
            <li>• Fraud watchlist contains 12 providers. 3 flagged for manual review today.</li>
            <li>• Chargeback ratio at 0.8%. Goal: stay below 1% by nurturing wallet adoption.</li>
            <li>• Verify KYC renewals for 240 providers expiring next week.</li>
          </ul>
          <button type="button" className="mt-4 text-xs font-semibold text-brand">
            View compliance dashboard →
          </button>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Global announcements</h2>
          <p className="mt-3 text-xs text-slate-500">Plan platform broadcast for New Year surge, highlighting surge pricing playbook and service quality guardrails.</p>
          <button type="button" className="mt-4 rounded-full border border-brand px-4 py-2 text-xs font-semibold text-brand transition hover:bg-brand hover:text-white">
            Draft announcement
          </button>
        </article>
      </section>
    </main>
  );
};

export default SuperAdminPanelPage;
