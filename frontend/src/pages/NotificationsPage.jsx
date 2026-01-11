import PageHeader from '../components/PageHeader.jsx';

const notifications = [
  {
    id: 'NTF-921',
    title: 'Your service is confirmed',
    description: 'FreshNest Cleaning Crew arrives on Tue, 2 Jan at 10:00 AM.',
    time: '2h ago',
    type: 'booking'
  },
  {
    id: 'NTF-917',
    title: 'Wallet cashback added',
    description: '₹220 cashback for completing 3 bookings this month.',
    time: 'Yesterday',
    type: 'wallet'
  },
  {
    id: 'NTF-902',
    title: 'Support ticket closed',
    description: 'Issue “Reschedule request” has been resolved.',
    time: '3 days ago',
    type: 'support'
  }
];

const typeStyles = {
  booking: 'bg-emerald-100 text-emerald-700',
  wallet: 'bg-amber-100 text-amber-700',
  support: 'bg-indigo-100 text-indigo-700'
};

const NotificationsPage = () => {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <PageHeader
        title="Notifications"
        description="Stay updated on booking changes, payments, and support tickets."
        actions={(
          <button type="button" className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-brand hover:text-brand">
            Mark all as read
          </button>
        )}
      />

      <section className="mt-8 space-y-4">
        {notifications.map((item) => (
          <article key={item.id} className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${typeStyles[item.type]}`}>{item.type}</span>
              <span className="text-[11px] text-slate-400">{item.time}</span>
            </div>
            <h2 className="text-sm font-semibold text-slate-900">{item.title}</h2>
            <p className="text-xs text-slate-500">{item.description}</p>
            <button type="button" className="self-start text-xs font-semibold text-brand">
              View details →
            </button>
          </article>
        ))}
      </section>
    </main>
  );
};

export default NotificationsPage;
