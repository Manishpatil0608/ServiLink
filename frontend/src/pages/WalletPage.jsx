import PageHeader from '../components/PageHeader.jsx';

const transactions = [
  { id: 'TXN-98214', type: 'Cashback', amount: '+₹220', date: '27 Dec', status: 'Settled' },
  { id: 'TXN-98102', type: 'Payment', amount: '-₹1,799', date: '24 Dec', status: 'Completed' },
  { id: 'TXN-97981', type: 'Refund', amount: '+₹540', date: '21 Dec', status: 'Pending' }
];

const WalletPage = () => {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <PageHeader
        title="Wallet & payments"
        description="Monitor balance, transactions, and redeem cashback. Funds auto-settle after each service."
        actions={(
          <div className="flex flex-wrap gap-2">
            <button type="button" className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-brand hover:text-brand">Add money</button>
            <button type="button" className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-brand hover:text-brand">Withdraw</button>
          </div>
        )}
      />

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">Available balance</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">₹2,450</p>
          <p className="mt-2 text-xs text-slate-500">Includes ₹320 reward credits expiring on 10 Jan.</p>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">Default payment method</p>
          <p className="mt-2 text-sm font-semibold text-slate-900">Axis Bank UPI • ****2241</p>
          <button type="button" className="mt-4 text-xs font-semibold text-brand">
            Update payment methods →
          </button>
        </article>
      </section>

      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Recent transactions</h2>
          <button type="button" className="text-xs font-semibold text-brand">Download statement</button>
        </div>
        <ul className="mt-4 space-y-3 text-xs text-slate-600">
          {transactions.map((txn) => (
            <li key={txn.id} className="flex flex-wrap items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-slate-900">{txn.type}</span>
                <span className="text-[11px] text-slate-500">{txn.id} • {txn.date}</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-sm font-semibold ${txn.amount.startsWith('+') ? 'text-emerald-600' : 'text-slate-900'}`}>{txn.amount}</span>
                <span className="text-[11px] text-slate-400">{txn.status}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default WalletPage;
