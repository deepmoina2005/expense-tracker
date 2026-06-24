import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Wallet, Menu, X, Sun, Moon } from 'lucide-react';
import { setThemeUI } from '../../features/preferences/preferencesSlice';
import FinixLogo from '../FinixLogo';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme } = useSelector((state) => state.preferences);
  const dispatch = useDispatch();

  const toggleTheme = () => {
    dispatch(setThemeUI(theme === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-sm'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="group">
            <FinixLogo iconSize={20} fontSize="text-xl" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all mr-1"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <Link
              to="/login"
              className="px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 text-sm font-bold text-white bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all active:scale-[0.98]"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-6 pt-2 space-y-1 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 space-y-2 px-2">
              {/* Mobile Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <Link to="/login" className="block text-center px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Log In
              </Link>
              <Link to="/register" className="block text-center px-4 py-3 text-sm font-bold text-white bg-linear-to-r from-indigo-600 to-violet-600 rounded-xl shadow-lg">
                Get Started Free
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
