const StatCard = ({ label, value, subtext, trend }) => {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-500">
        <span>{label}</span>
        {trend ? <span className={`font-semibold ${trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>{trend}</span> : null}
      </div>
      <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
      {subtext ? <p className="mt-1 text-xs text-slate-500">{subtext}</p> : null}
    </article>
  );
};

export default StatCard;
