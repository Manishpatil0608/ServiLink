import PageHeader from '../components/PageHeader.jsx';
import { useAuth } from '../hooks/useAuth.js';
import getDisplayName from '../utils/getDisplayName.js';

const serviceSnapshots = [
  {
    service: 'Deep home cleaning',
    activeProviders: 42,
    activeCustomers: 310,
    satisfaction: '4.7★',
    escalations: 3
  },
  {
    service: 'Salon at home - Luxe',
    activeProviders: 28,
    activeCustomers: 180,
    satisfaction: '4.9★',
    escalations: 1
  },
  {
    service: 'Smart appliance repair',
    activeProviders: 36,
    activeCustomers: 126,
    satisfaction: '4.5★',
    escalations: 5
  }
];

const escalationHeatmap = [
  { category: 'Cleaning', count: 12, sla: '28 mins', severity: 'medium' },
  { category: 'Electrical', count: 7, sla: '42 mins', severity: 'high' },
  { category: 'Plumbing', count: 5, sla: '31 mins', severity: 'medium' },
  { category: 'Appliance', count: 3, sla: '24 mins', severity: 'low' }
];

const breachLeaderboard = [
  { provider: 'SparkClean Services', breaches: 2, avgDelay: '18 mins', action: 'Mentor session on Jan 05' },
  { provider: 'VoltFix Electricians', breaches: 1, avgDelay: '26 mins', action: 'Escalated to regional lead' },
  { provider: 'PlumbSure Experts', breaches: 1, avgDelay: '12 mins', action: 'Reminder sent to on-call crew' }
];

const ServiceAdminPanelPage = () => {
  const { user } = useAuth();
  const displayName = getDisplayName(user);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <PageHeader
        title="Service admin console"
        description={`Signed in as ${displayName || 'service admin'}. Monitor providers and customers across the services you manage. Resolve escalations faster and keep quality scores high.`}
        actions={(
          <div className="flex flex-wrap gap-2">
            <button type="button" className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-brand hover:text-brand">Assign provider</button>
            <button type="button" className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-brand hover:text-brand">Export summary</button>
          </div>
        )}
      />

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">Active services</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">12</p>
          <p className="mt-1 text-xs text-slate-400">Updated 5 mins ago</p>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">Open escalations</p>
          <p className="mt-3 text-3xl font-semibold text-amber-600">04</p>
          <p className="mt-1 text-xs text-slate-400">Response SLA 35 mins</p>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">Average NPS</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">71</p>
          <p className="mt-1 text-xs text-slate-400">↑ 5 points this week</p>
        </article>
      </section>

      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Service snapshots</h2>
          <button type="button" className="text-xs font-semibold text-brand">View all services →</button>
        </div>
        <div className="mt-4 space-y-4">
          {serviceSnapshots.map((item) => (
            <article key={item.service} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.service}</p>
                <p className="text-[11px] text-slate-500">Providers {item.activeProviders} • Customers {item.activeCustomers}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-600">
                <span>Satisfaction {item.satisfaction}</span>
                <span>Escalations {item.escalations}</span>
              </div>
              <button type="button" className="text-xs font-semibold text-brand">Manage →</button>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Provider health monitor</h2>
          <ul className="mt-4 space-y-3 text-xs text-slate-600">
            <li>• 6 providers flagged for low punctuality. Schedule refresher training.</li>
            <li>• 12 providers pending KYC updates. Auto-reminders sent today.</li>
            <li>• 4 probationary providers hitting 4.8★ after onboarding program.</li>
          </ul>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Customer insights</h2>
          <ul className="mt-4 space-y-3 text-xs text-slate-600">
            <li>• Repeat bookings up by 18% for cleaning services.</li>
            <li>• Top feedback theme: "Prefer shorter arrival windows".</li>
            <li>• Launch loyalty pilot for high-LTV customers next week.</li>
          </ul>
        </article>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Escalation heat map</h2>
          <table className="mt-4 w-full table-fixed text-left text-xs text-slate-600">
            <thead>
              <tr className="text-slate-500">
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Open cases</th>
                <th className="pb-3 font-semibold">Avg SLA</th>
                <th className="pb-3 font-semibold">Severity</th>
              </tr>
            </thead>
            <tbody>
              {escalationHeatmap.map((row) => (
                <tr key={row.category} className="border-t border-slate-100">
                  <td className="py-3 text-slate-700">{row.category}</td>
                  <td className="py-3 font-semibold text-slate-900">{row.count}</td>
                  <td className="py-3">{row.sla}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${row.severity === 'high' ? 'bg-red-100 text-red-600' : row.severity === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {row.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className="mt-4 text-xs font-semibold text-brand">Open escalations dashboard →</button>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">SLA breach leaderboard</h2>
          <ul className="mt-4 space-y-3 text-xs text-slate-600">
            {breachLeaderboard.map((item) => (
              <li key={item.provider} className="rounded-2xl border border-slate-200 px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">{item.provider}</p>
                <p className="mt-1 text-[11px] text-slate-500">Breaches {item.breaches} • Avg delay {item.avgDelay}</p>
                <p className="mt-1 text-[11px] text-slate-500">{item.action}</p>
              </li>
            ))}
          </ul>
          <button type="button" className="mt-4 text-xs font-semibold text-brand">Schedule coaching session →</button>
        </article>
      </section>
    </main>
  );
};

export default ServiceAdminPanelPage;
