import { Link } from 'react-router-dom';

const FOOTER_LINKS = {
  Company: [
    { label: 'About', href: '/support' },
    { label: 'Careers', href: '/support' },
    { label: 'Press', href: '/support' }
  ],
  Support: [
    { label: 'Help Center', href: '/support' },
    { label: 'Safety', href: '/support' },
    { label: 'Cancellations', href: '/support' }
  ],
  Legal: [
    { label: 'Privacy', href: '/support' },
    { label: 'Terms', href: '/support' },
    { label: 'Fees', href: '/support' }
  ]
};

const SiteFooter = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-y-10 px-6 py-12 md:grid-cols-[1.1fr,0.9fr]">
        <div className="flex flex-col gap-4">
          <span className="text-xl font-semibold text-brand">ServiLink</span>
          <p className="text-sm text-slate-500">Empowering trusted local professionals with technology that keeps customers delighted.</p>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} ServiLink Technologies Pvt. Ltd. All rights reserved.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section} className="flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{section}</span>
              <ul className="space-y-2 text-sm text-slate-500">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="transition hover:text-brand">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
