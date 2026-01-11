import PageHeader from '../components/PageHeader.jsx';
import { useAuth } from '../hooks/useAuth.js';
import getDisplayName from '../utils/getDisplayName.js';
import { useNavigate } from 'react-router-dom';

const serviceStats = [
  { label: 'Active services', value: '08', trend: '+1 new this month' },
  { label: 'Upcoming jobs', value: '05', trend: 'Next slot today' },
  { label: 'Average rating', value: '4.86', trend: '12 new reviews' }
];

const payoutForecast = {
  nextPayoutDate: 'Jan 03, 2025',
  expectedAmount: '₹42,750',
  pendingInvoices: 3,
  notes: [
    'Includes cleared wallet transfers and completed jobs through Dec 30.',
    'Expedite verification for 1 invoice to unlock additional ₹4,200.'
  ]
};

const satisfactionTrend = [
  { label: 'Week 1', rating: 4.6, delta: '+0.1' },
  { label: 'Week 2', rating: 4.7, delta: '+0.1' },
  { label: 'Week 3', rating: 4.8, delta: '+0.2' },
  { label: 'Week 4', rating: 4.9, delta: '+0.1' }
];

const ProviderDashboardPage = () => {
  const { user } = useAuth();
  const displayName = getDisplayName(user);
  const navigate = useNavigate();

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <PageHeader
        title="Provider console"
        description={`Signed in as ${displayName || 'your provider account'}. Manage services, availability, ratings, and payouts. Boost performance with personalized tips.`}
        actions={(
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-brand hover:text-brand"
              onClick={() => navigate('/provider/availability')}
            >
              Update availability
            </button>
            <button
              type="button"
              className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-brand hover:text-brand"
              onClick={() => navigate('/provider/services/new')}
            >
              Add new service
            </button>
          </div>
        )}
      />

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        {serviceStats.map((stat) => (
          <article key={stat.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">{stat.label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{stat.value}</p>
            <p className="mt-1 text-xs text-slate-400">{stat.trend}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Today's schedule</h2>
          <ul className="mt-4 space-y-3 text-xs text-slate-600">
            <li className="flex flex-wrap items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span>10:00 AM • Deep clean • Bandra</span>
              <span className="text-emerald-600">Checked in</span>
            </li>
            <li className="flex flex-wrap items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span>2:30 PM • Sofa shampoo • Worli</span>
              <span className="text-amber-600">Prep pending</span>
            </li>
            <li className="flex flex-wrap items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span>6:00 PM • Post-paint cleanup • Powai</span>
              <span className="text-slate-500">Awaiting confirmation</span>
            </li>
          </ul>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Performance insights</h2>
          <ul className="mt-4 space-y-3 text-xs text-slate-600">
            <li>• Response time has improved to 12 mins. Keep it under 15 mins to stay in Top Rated.</li>
            <li>• Add festive cleaning bundle to unlock 15% more bookings in January.</li>
            <li>• Customers love your punctuality. Encourage ratings to climb to 4.9+.</li>
          </ul>
          <button type="button" className="mt-4 text-xs font-semibold text-brand">
            View detailed analytics →
          </button>
        </article>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Payout forecast</h2>
          <dl className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <dt className="text-xs uppercase tracking-wide text-slate-500">Next payout</dt>
              <dd className="mt-2 text-lg font-semibold text-slate-900">{payoutForecast.expectedAmount}</dd>
              <p className="text-xs text-slate-500">Scheduled {payoutForecast.nextPayoutDate}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <dt className="text-xs uppercase tracking-wide text-slate-500">Pending invoices</dt>
              <dd className="mt-2 text-lg font-semibold text-slate-900">{payoutForecast.pendingInvoices}</dd>
              <p className="text-xs text-slate-500">Awaiting verification</p>
            </div>
          </dl>
          <ul className="mt-4 space-y-2 text-xs text-slate-600">
            {payoutForecast.notes.map((note) => (
              <li key={note}>• {note}</li>
            ))}
          </ul>
          <button type="button" className="mt-4 text-xs font-semibold text-brand">
            Review payouts →
          </button>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Customer satisfaction trend</h2>
          <ul className="mt-4 space-y-3 text-xs text-slate-600">
            {satisfactionTrend.map((week) => (
              <li key={week.label} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                <span className="font-medium text-slate-700">{week.label}</span>
                <span className="flex items-baseline gap-2 text-slate-500">
                  <span className="text-sm font-semibold text-slate-900">{week.rating.toFixed(1)}</span>
                  <span className="text-emerald-600">{week.delta}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-slate-500">Keep responses under 2 hours to unlock “Elite Provider” badge next quarter.</p>
        </article>
      </section>
    </main>
  );
};

export default ProviderDashboardPage;
