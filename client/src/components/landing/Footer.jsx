import { Link } from 'react-router-dom';
import { Wallet, Globe, MessageCircle, Link2, Mail } from 'lucide-react';
import FinixLogo from '../FinixLogo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Dashboard', to: '/login' },
    ],
    Company: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
    ],
    Legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
    ],
  };

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 py-16 lg:py-24 dark-transition">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="col-span-2 space-y-8">
            <Link to="/" className="group">
              <FinixLogo iconSize={24} fontSize="text-2xl" />
            </Link>
            <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm font-medium">
              Smart personal finance tracker built for the modern era. 
              Gain total control over your spending and reach your goals faster with Finix.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4">
              {[
                { icon: MessageCircle, href: '#' },
                { icon: Globe, href: '#' },
                { icon: Link2, href: '#' },
                { icon: Mail, href: '#' },
              ].map(({ icon: Icon, href }, idx) => (
                <a
                  key={idx}
                  href={href}
                  className="w-11 h-11 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-100 dark:border-slate-800 transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-6">
              <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                {title}
              </h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link
                        to={link.to}
                        className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-20 pt-10 border-t border-slate-50 dark:border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
            © {currentYear} Finix. All rights reserved.
          </p>
          <div className="flex items-center gap-8 text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Security</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy</a>
            <span className="flex items-center gap-2">
              Built with <span className="text-rose-500">❤️</span> for you
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
