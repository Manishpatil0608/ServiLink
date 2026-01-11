import PageHeader from '../components/PageHeader.jsx';

const supportTopics = [
  {
    title: 'Bookings & cancellations',
    description: 'Reschedule, cancel, or escalate booking issues directly to your category admin.'
  },
  {
    title: 'Wallet & payments',
    description: 'Track refunds, payouts, and payment methods linked to your account.'
  },
  {
    title: 'Safety & standards',
    description: 'Learn how we verify professionals and what to expect during every service.'
  }
];

const SupportPage = () => {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <PageHeader
        title="Help center"
        description="Open support tickets, chat with admins, or explore guides curated for customers and providers."
        actions={(
          <button type="button" className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-dark">
            Start a live chat
          </button>
        )}
      />

      <section className="mt-8 grid gap-6">
        {supportTopics.map((topic) => (
          <article key={topic.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">{topic.title}</h2>
            <p className="mt-2 text-xs text-slate-500">{topic.description}</p>
            <button type="button" className="mt-4 text-xs font-semibold text-brand">
              Browse articles →
            </button>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-sm font-semibold text-slate-900">Need urgent assistance?</h2>
        <p className="mt-2 text-xs text-slate-500">Our master admin team is available 24/7 for escalations. Average response time 8 minutes.</p>
        <button type="button" className="mt-3 rounded-full border border-brand px-4 py-2 text-xs font-semibold text-brand transition hover:bg-brand hover:text-white">
          Call support desk
        </button>
      </section>
    </main>
  );
};

export default SupportPage;
