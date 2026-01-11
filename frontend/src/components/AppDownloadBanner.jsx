const AppDownloadBanner = () => {
  return (
    <section className="py-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 rounded-3xl bg-gradient-to-r from-brand to-brand-dark px-8 py-14 text-center text-white shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-white/70">Get the app</p>
        <h2 className="text-3xl font-semibold">Manage your bookings on the go.</h2>
        <p className="max-w-2xl text-sm text-white/80">Track professionals in real time, chat with support, and earn wallet rewards for every completed service. Available on Android and iOS.</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand shadow-md transition hover:bg-slate-100">
            Download on Play Store
          </button>
          <button type="button" className="rounded-full border border-white/70 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
            Download on App Store
          </button>
        </div>
      </div>
    </section>
  );
};

export default AppDownloadBanner;
