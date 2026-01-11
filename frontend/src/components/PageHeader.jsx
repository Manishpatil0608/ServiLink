const PageHeader = ({ title, description, actions }) => {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 pb-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
        {description ? <p className="max-w-2xl text-sm text-slate-500">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </header>
  );
};

export default PageHeader;
