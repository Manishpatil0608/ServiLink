import PageHeader from '../components/PageHeader.jsx';
import { useAuth } from '../hooks/useAuth.js';
import getDisplayName from '../utils/getDisplayName.js';

const pendingApprovals = [
  { name: 'SparklePro Cleaning', submitted: '26 Dec', documents: 'KYC, GST, Team IDs', status: 'Awaiting review' },
  { name: 'UrbanFix Handymen', submitted: '24 Dec', documents: 'KYC, Portfolio', status: 'In verification' }
];

const CategoryAdminPanelPage = () => {
  const { user } = useAuth();
  const displayName = getDisplayName(user);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <PageHeader
        title="Category admin panel"
        description={`Signed in as ${displayName || 'category admin'}. Approve providers, moderate bookings, and review escalations within your category.`}
        actions={(
          <button type="button" className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-dark">
            Create broadcast
          </button>
        )}
      />

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr,0.95fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Pending provider approvals</h2>
          <ul className="mt-4 space-y-3 text-xs text-slate-600">
            {pendingApprovals.map((item) => (
              <li key={item.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                <p className="mt-1 text-[11px] text-slate-500">Submitted {item.submitted} • Documents: {item.documents}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" className="rounded-full border border-emerald-500 px-3 py-2 text-[11px] font-semibold text-emerald-600 transition hover:bg-emerald-50">
                    Approve
                  </button>
                  <button type="button" className="rounded-full border border-rose-500 px-3 py-2 text-[11px] font-semibold text-rose-600 transition hover:bg-rose-50">
                    Decline
                  </button>
                  <span className="rounded-full bg-brand/10 px-3 py-2 text-[11px] font-semibold text-brand">{item.status}</span>
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Escalations & SLA tracker</h2>
          <ul className="mt-4 space-y-3 text-xs text-slate-600">
            <li>• 2 escalations pending response (avg. age 3h). Assign to supervisors.</li>
            <li>• Category SLA compliance at 96%. Goal this month: 98%.</li>
            <li>• Auto-remind providers with punctuality score below 4.3.</li>
          </ul>
          <button type="button" className="mt-4 text-xs font-semibold text-brand">
            View escalation board →
          </button>
        </article>
      </section>
    </main>
  );
};

export default CategoryAdminPanelPage;
